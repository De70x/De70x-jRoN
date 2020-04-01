import {Meteor} from 'meteor/meteor';
import {ListeJoueurs} from "../lib/collections/mongoJoueurs";
import {CartesTirees} from "../lib/collections/mongoCartesTirees";
import {CartesCentrales} from "../lib/collections/mongoCartesCentrales";
import {PhaseEnCours} from "../lib/collections/mongoPhaseEnCours";
import {Paquet} from "../lib/collections/mongoPaquet";
import {Joueur} from "../imports/ui/joueur/joueur";
import {Carte} from "../imports/ui/carte/carte";
import {DonsGorgees} from "../lib/collections/mongoDonsGorgees";

Meteor.startup(() => {
    Meteor.methods({
        'insertJoueur': function (pseudo) {
            try {
                if (pseudo.length > 1 && ListeJoueurs.find({pseudo: pseudo}).count() === 0) {
                    let ordreMax = 0;
                    const listeJoueurs = ListeJoueurs.find({_id:{$exists:true}}, {fields:{'ordreJoueur':1}});
                    listeJoueurs.forEach(joueur => {
                        if(joueur.ordreJoueur > ordreMax){
                            ordreMax = joueur.ordreJoueur;
                        }
                    });
                    const joueurAInsere = new Joueur(pseudo, ordreMax+1);
                    ListeJoueurs.insert(joueurAInsere);
                    return joueurAInsere;
                } else {
                    return null;
                }
            } catch (error) {
                console.log("Probleme à l'insertion du joueur : " + pseudo + " erreur : " + error);
            }
        },
        'premierJoueur': () => {
            try {
                const joueurs = ListeJoueurs.find({_id:{$exists:true}},{fields:{'ordreJoueur':1}});
                let ordreMax = 0;
                let idPremier = -1;
                joueurs.forEach(joueur => {
                    if(joueur.ordreJoueur > ordreMax){
                        ordreMax = joueur.ordreJoueur;
                        idPremier = joueur._id;
                    }
                });
                ListeJoueurs.update({_id: idPremier}, {$set: {tourEnCours: true}});
                return true;
            } catch (error) {
                console.log("erreur a la détermination du MJ : " + error);
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
        'piocher': function (nbCartes) {
            try {
                const cartesTirees = [];
                const nbCartesRestantes = Paquet.find({_id:{$exists:true}}).count();

                for(let i=0; i<nbCartes; i++){
                    // Du fait que s'il y a plusieurs paquet, ils sont mélangés séparément, on génère de nouveau
                    // un caractère aléatoire ici pour que cela reste equiprobable.
                    const nbAleatoire = Math.floor(Math.random() * (nbCartesRestantes-i));
                    const carteTiree = Paquet.find({_id:{$exists:true}}).fetch()[nbAleatoire];
                    Paquet.remove({_id:carteTiree._id});
                    cartesTirees.push(carteTiree);
                }
                return cartesTirees;
            } catch (error) {
                console.log("Probleme au moment de piocher" + error);
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
                const idJoueursEtCartes = ListeJoueurs.find({}, {fields: {'_id': 1, 'mainDuJoueur': 2}}).fetch();
                // L'id du joueur courant
                const idJoueurEnCours = ListeJoueurs.findOne({tourEnCours: true}, {fields: {'_id': 1}});

                // Le joueur ayant le moins de carte sera le joueur en cours
                let idJoueurSuivant = -1;
                let nbCarte = 3;
                idJoueursEtCartes.forEach(joueur => {
                    if (joueur.mainDuJoueur.length <= nbCarte) {
                        nbCarte = joueur.mainDuJoueur.length;
                        idJoueurSuivant = joueur;
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
        'clearDB': () => {
            try {
                CartesCentrales.remove({});
                CartesTirees.remove({});
                ListeJoueurs.remove({});
                PhaseEnCours.remove({});
                Paquet.remove({});
                DonsGorgees.remove({});
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
        'resolution': (rang, prendsOuDonnes, nbGorgees) => {
            try {
                // On remet dans un premier temps les gorgees a 0
                ListeJoueurs.update({_id:{$exists:true}},{$set:{tp:false, nbGorgeesP:0, td:false, nbGorgees:0}}, {multi:true});
                console.log(nbGorgees);
                ListeJoueurs.update({}, {$set : {tp: false, td:false}}, {multi:true});
                const cartesJoueurs = ListeJoueurs.find({_id:{$exists:true}}).fetch();
                cartesJoueurs.forEach(joueur => {
                    const listeRangsJoueur = [];
                    joueur.mainDuJoueur.forEach(carte => {
                        listeRangsJoueur.push(carte.rank.shortName);
                    });
                    let coef = 0;
                    listeRangsJoueur.forEach(rangMainJoueur=>{
                        if(rangMainJoueur === rang){
                            coef++;
                        }
                    });
                    if(listeRangsJoueur.includes(rang)){
                        if(prendsOuDonnes === "prends"){
                            ListeJoueurs.update({_id:joueur._id},{$set:{tp:true, nbGorgeesP:nbGorgees*coef}});
                        }
                        if(prendsOuDonnes === "donnes"){
                            ListeJoueurs.update({_id:joueur._id},{$set:{td:true, nbGorgeesD:nbGorgees*coef}});
                            DonsGorgees.insert({joueur:joueur._id, donsEnCours:false});
                        }
                    }
                });
                if(DonsGorgees.find({_id:{$exists:true}}).count() !== 0){
                    return "donsAFaire";
                }
                return null;

            } catch (error) {
                console.log("erreur a la résolution des cartes : " + error);
            }
        },
        'donsGorgees': (idEmmeteur, idDestinataire, nbGorgees) => {
            try {
                const pseudoEmmeteur = ListeJoueurs.findOne({_id:idEmmeteur}).pseudo;
                const pseudoDestinataire = ListeJoueurs.findOne({_id:idDestinataire}).pseudo;
                ListeJoueurs.update({_id:idEmmeteur}, {$inc : {nbGorgeesD: -nbGorgees}});
                const nbGorgeesRestantes = ListeJoueurs.findOne({_id:idEmmeteur}).nbGorgeesD;

                if(nbGorgeesRestantes ===0){
                    const idDelete = DonsGorgees.findOne({joueur:idEmmeteur})._id;
                    DonsGorgees.remove({_id:idDelete});
                }
                let don="";
                // on affiche le message avant le delete
                if(idEmmeteur === idDestinataire){
                    don += "Dans un élan de générosité inégalé... " + pseudoEmmeteur + " s'autoflagelle";
                }
                else {
                    don = pseudoEmmeteur + " donne " + nbGorgees;
                    if(nbGorgees%5 === 0){
                        don += " cul sec ";
                    }
                    else if (nbGorgees > 1) {
                        don += " gorgées ";
                    } else {
                        don += " gorgée ";
                    }
                    don += "à " + pseudoDestinataire;
                }
                return don;
            } catch (error) {
                console.log("erreur lors du don : " + error);
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