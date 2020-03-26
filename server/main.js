import {Meteor} from 'meteor/meteor';
import {ListeJoueurs} from "../lib/collections/mongoJoueurs";
import {CartesTirees} from "../lib/collections/mongoCartesTirees";
import {CartesCentrales} from "../lib/collections/mongoPhaseFinale";
import {PhaseEnCours} from "../lib/collections/mongoPhaseEnCours";
import {Joueur} from "../imports/ui/joueur/joueur";
import {Carte} from "../imports/ui/carte/carte";
import {CarteCentrale} from "../imports/ui/carte/carteCentrale";


Meteor.startup(() => {
    Router.route('/init', function () {
        this.render('phaseZeroTemplate');
    });
    Meteor.methods({
        'insertJoueur': function (pseudo) {
            try {
                if (pseudo.length > 1 && ListeJoueurs.find({pseudo: pseudo}).count() === 0) {
                    const nbJoueurs = ListeJoueurs.find({_id: {$exists: true}}).count();
                    let i = 1;
                    // On récupère le premier ordre disponbile pour ne pas avoir de doublons si quelqu'un se barre en milieu de partie
                    while (ListeJoueurs.find({ordreJoueur: i}).count() !== 0) {
                        i++;
                    }
                    var joueurAInsere = new Joueur(pseudo, i);
                    if (nbJoueurs === 0) {
                        joueurAInsere.tourEnCours = true;
                    }
                    ListeJoueurs.insert(joueurAInsere);
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log("Probleme à l'insertion du joueur : " + pseudo + " erreur : " + error);
            }
        },
        'deleteJoueur': function (pseudo) {
            try {
                console.log("Pseudo à supprimer : " + pseudo);
                if (ListeJoueurs.find({pseudo: pseudo}).count() !== 0) {
                    console.log("tentative de suppression");
                    ListeJoueurs.remove({pseudo: pseudo});
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log("Probleme à la suppression du joueur : " + pseudo + " erreur : " + error);
            }
        },
        'insertCarte': function (carte) {
            try {
                const nbCartesTirees = CartesTirees.find({_id: {$exists: true}}).count();
                CartesTirees.insert(new Carte(carte, nbCartesTirees + 1));
                return true;
            } catch (error) {
                console.log("Probleme à l'insertion de la carte' : " + carte + " erreur : " + error);
            }
        },
        'insertCarteJoueur': function (carte, id) {
            try {
                ListeJoueurs.update({_id: id._id}, {$push: {mainDuJoueur: carte}});
                return true;
            } catch (error) {
                console.log("Probleme à l'insertion de la carte' : " + carte + " erreur : " + error);
            }
        },
        'nextJoueur': function () {
            try {
                // On récupère la liste des id ordonnée avec la colonne ordreJoueur
                var idJoueursEtCartes = ListeJoueurs.find({}, {fields: {'_id': 1, 'mainDuJoueur': 2}}).fetch();
                console.log(idJoueursEtCartes);
                // L'id du joueur courant
                var idJoueurEnCours = ListeJoueurs.findOne({tourEnCours: true}, {fields: {'_id': 1}});

                // Le joueur ayant le moins de carte sera le joueur en cours
                var idJoueurSuivant = -1;
                var nbCarte = 3;
                idJoueursEtCartes.forEach(elem => {
                    if (elem.mainDuJoueur.length <= nbCarte) {
                        nbCarte = elem.mainDuJoueur.length;
                        idJoueurSuivant = elem;
                    }
                });
                // S'il n'y a pas de joueurs suivant, on doit passer à la phase 2
                if (idJoueurSuivant === -1) {
                    console.log("PHASE 2");
                    return false;
                }
                // On update les joueurs en conséquence
                ListeJoueurs.update({_id: idJoueurEnCours._id}, {$set: {tourEnCours: false}});
                ListeJoueurs.update({_id: idJoueurSuivant._id}, {$set: {tourEnCours: true}});
                return true;
            } catch (error) {
                console.log("Probleme pour NextJoueur :");
                console.log(error);
            }
        },
        'phaseFinale': (cartesCentrales) => {
            try {
                const nbCartesTirees = CartesTirees.find({_id: {$exists: true}}).count();
                let i = 1;
                cartesCentrales.forEach(carte => {
                    CartesCentrales.insert(new CarteCentrale(carte,i));
                    i++;
                });
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'changerPhase': (phase) => {
            try {
                let idPhaseEnCours = PhaseEnCours.find({_id: {$exists: true}}, {fields : {'_id' : 1}}).fetch();
                PhaseEnCours.upsert({_id:idPhaseEnCours},{phase: phase});
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'onEnEstOu': () => {
            try {
                let idPhaseEnCours = PhaseEnCours.find({_id: {$exists: true}}, {fields : {'phase' : 1}}).fetch();
                PhaseEnCours.upsert({phase: 'phasePreliminaire'});
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        }
    });
});
