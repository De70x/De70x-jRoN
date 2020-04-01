import {Template} from "meteor/templating";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import {getUnicode} from "../jeu/phasePreliminaire";

let joueurScript = "";
let chance = "";


Template.joueurs.onCreated(function () {
    Meteor.subscribe('joueurs');
});

Template.joueurs.helpers({
    isRed: (card) => {
        if (card !== undefined) {
            var couleur = card.suit.name;
        }
        return couleur === "hearts" || couleur === "diamonds";
    },
    getUnicode: (carte) => {
        return getUnicode(carte);
    },
    isEnCours: (joueur) => {
        return joueur.tourEnCours;
    },
    isMJ: (joueur) => {
        return joueur.maitreDuJeu;
    },
    joueurs: ListeJoueurs.find(),
    tuPrends: (joueur) => {
        let vRet = "";
        if(joueur.tp){
            if(joueur.nbGorgeesP%5 === 0){
                vRet += "<img height=\"30\" src=\"/images/culsec.png\"/>x" + (joueur.nbGorgeesP/5);
            }
            else{
                vRet += "<img height=\"21\" src=\"/images/drink.png\"/>x" + joueur.nbGorgeesP;
            }
        }
        return Spacebars.SafeString(vRet);
    },
    tuDonnes: (joueur) => {
        const joueurSession = ListeJoueurs.find({pseudo: Session.get("pseudoSession")}).fetch()[0];
        const joueursLocaux = ConnexionsLocales.find({_id:{$exists:true}}).fetch();
        let unJoueurLocalDonne;
        if(joueursLocaux !== undefined){
            joueursLocaux.forEach(joueurLocal => {

            });
        }

        return joueurSession !== undefined && joueurSession.td && joueur.pseudo !== Session.get("pseudoSession");
    },
    idJoueur: (joueur) => {
        return joueur._id;
    },
    jokerActif: () => {
        return ListeJoueurs.find({joker: true}).count() !== 0;
    },
    joueurScript: joueurScript,
    marqueTuDonnes: (joueur) => {
        return joueur.td;
    },
    score: chance,
});

Template.joueurs.events({
    'click .tuDonnes'(event) {
        Meteor.call('RAZJoker', (error, result) => {
            if (error) {
                console.log(" Erreur dans le delete total : ");
                console.log(error);
            } else {
            }
        });
        chance = Math.floor(Math.random() * 7);
        console.log(chance);
        if(chance === 6) {
            Meteor.call('jokerDB', event.target.id, (error, result) => {
                if (error) {
                    console.log(" Erreur dans le delete total : ");
                    console.log(error);
                } else {
                    joueurScript = result;
                    console.log(joueurScript);
                }
            });
        }
    },
});