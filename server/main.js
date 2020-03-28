import {Meteor} from 'meteor/meteor';
import {ListeJoueurs} from "../lib/collections/mongoJoueurs";
import {CartesTirees} from "../lib/collections/mongoCartesTirees";
import {CartesCentrales} from "../lib/collections/mongoCartesCentrales";
import {PhaseEnCours} from "../lib/collections/mongoPhaseEnCours";
import {Paquet} from "../lib/collections/mongoPaquet";
import {Joueur} from "../imports/ui/joueur/joueur";
import {Carte} from "../imports/ui/carte/carte";


Meteor.startup(() => {
    Meteor.methods({
        'getNbJoueurs': function () {
            try {
                return ListeJoueurs.find({_id: {$exists: true}}).count();
            } catch (error) {
                console.log("Probleme à la récupération du nombre de joueurs" + error);
            }
        },
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
                if (ListeJoueurs.find({pseudo: pseudo}).count() !== 0) {
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
                const idJoueursEtCartes = ListeJoueurs.find({}, {fields: {'_id': 1, 'mainDuJoueur': 2}}).fetch();
                // L'id du joueur courant
                const idJoueurEnCours = ListeJoueurs.findOne({tourEnCours: true}, {fields: {'_id': 1}});

                // Le joueur ayant le moins de carte sera le joueur en cours
                let idJoueurSuivant = -1;
                let nbCarte = 3;
                idJoueursEtCartes.forEach(elem => {
                    if (elem.mainDuJoueur.length <= nbCarte) {
                        nbCarte = elem.mainDuJoueur.length;
                        idJoueurSuivant = elem;
                    }
                });
                // S'il n'y a pas de joueurs suivant, on doit passer à la phase 2
                if (idJoueurSuivant === -1) {
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
        'prepaPhaseFinale': (cartesCentrales) => {
            try {
                let i = 0;
                cartesCentrales.forEach(carte => {
                    if (i === 0) {
                        carte.retournable = true;
                    }
                    CartesCentrales.insert(carte);
                    i++
                });
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'changerPhase': (phase) => {
            try {
                let idPhaseEnCours = PhaseEnCours.find({_id: {$exists: true}}, {fields: {'_id': 1}}).fetch()[0];
                if (idPhaseEnCours !== undefined) {
                    PhaseEnCours.upsert({_id: idPhaseEnCours._id}, {phase: phase});
                } else {
                    PhaseEnCours.insert({phase: phase});
                }
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'onEnEstOu': () => {
            try {
                let idPhaseEnCours = PhaseEnCours.find({_id: {$exists: true}}, {fields: {'phase': 1}}).fetch();
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'clearDB': () => {
            try {
                CartesCentrales.remove({});
                CartesTirees.remove({});
                ListeJoueurs.remove({});
                PhaseEnCours.remove({});
                Paquet.remove({});
                return true;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'nextCarte': (numeroTirage) => {
            try {
                let idCarte = CartesCentrales.find({numeroTirage: numeroTirage}, {fields: {'_id': 1}}).fetch()[0];
                let idCarteSuivante = CartesCentrales.find({numeroTirage: numeroTirage + 1}, {fields: {'_id': 1}}).fetch()[0];
                if (idCarte !== undefined) {
                    CartesCentrales.update({_id: idCarte._id}, {$set: {retournee: true}});
                    if (idCarteSuivante !== undefined) {
                        CartesCentrales.update({_id: idCarteSuivante._id}, {$set: {retournable: true}});
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'repioche': (carteTiree) => {
            try {
                // On récupère les id des cartes retournées
                const listIdCartesRetournees = CartesCentrales.find({retournee: true}, {fields: {'_id': 1}}).fetch();
                const idDerniereCarteRetournee = listIdCartesRetournees[listIdCartesRetournees.length - 1]._id;
                CartesCentrales.update({_id: idDerniereCarteRetournee}, {$set: {carte: carteTiree}});
                return listIdCartesRetournees.length - 1;
            } catch (error) {
                console.log("erreur lors de la génération de la phase finale: " + error);
            }
        },
        'choisirMJ': () => {
            try {
                // On retire le précédent MJ
                ListeJoueurs.update({maitreDuJeu:true}, {$set : {maitreDuJeu: false}}, {multi:true});
                const nbJoueurs = ListeJoueurs.find({_id: {$exists: true}}).count();
                const nbAleatoire = Math.random() * nbJoueurs;
                const idAleatoire = Math.floor(nbAleatoire);
                const idMJ = ListeJoueurs.find({_id: {$exists: true}}).fetch()[idAleatoire]._id;
                ListeJoueurs.update({_id: idMJ}, {$set: {maitreDuJeu: true}});
                return true;
            } catch (error) {
                console.log("erreur a la détermination du MJ : " + error);
            }
        },
        'resolution': (rang, prendsOuDonnes) => {
            try {
                console.log(prendsOuDonnes);
                ListeJoueurs.update({}, {$set : {tp: false, td:false}}, {multi:true});
                const cartesJoueurs = ListeJoueurs.find({_id:{$exists:true}}).fetch();
                const idAUpdate = [];
                cartesJoueurs.forEach(joueur => {
                    const listeRangsJoueur = [];
                    joueur.mainDuJoueur.forEach(carte => {
                        listeRangsJoueur.push(carte[0].rank.shortName);
                    });
                    if(listeRangsJoueur.includes(rang)){
                        idAUpdate.push(joueur._id);
                    }
                });
                console.log(idAUpdate);
                idAUpdate.forEach(id => {
                    console.log(prendsOuDonnes);
                    if(prendsOuDonnes === "prends"){
                        ListeJoueurs.update({_id:id},{$set:{tp:true}});
                    }
                    if(prendsOuDonnes === "donnes"){
                        ListeJoueurs.update({_id:id},{$set:{td:true}});
                    }
                });

            } catch (error) {
                console.log("erreur a la résolution des cartes : " + error);
            }
        },
        'restart': () => {
            try {
                // On remet la base à zero sauf les joueurs
                CartesCentrales.remove({});
                CartesTirees.remove({});
                PhaseEnCours.remove({});
                ListeJoueurs.remove({});
                return true;
            } catch (error) {
                console.log("erreur lors du restart " + error);
            }
        },
        'jokerDB': (id) => {
            try {
                const jouerClique = ListeJoueurs.find({_id:id}, {fields:{'pseudo':1}}).fetch()[0];
                ListeJoueurs.update({_id:id}, {$set:{joker:true}});
                return jouerClique.pseudo;
            } catch (error) {
                console.log("erreur lors du joker : " + error);
            }
        },
        'RAZJoker': () => {
            console.log("RAZ des joker ! ");
            try {
                ListeJoueurs.update({maitreDuJeu:true}, {$set : {joker: false}}, {multi:true});
                return true;
            } catch (error) {
                console.log("erreur lors du joker : " + error);
            }
        },
    });
});

