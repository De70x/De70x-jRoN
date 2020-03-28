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
        if (card[0] !== undefined) {
            var couleur = card[0].suit.name;
        }
        return couleur === "hearts" || couleur === "diamonds";
    },
    getUnicode: (carte) => {
        return getUnicode(carte[0]);
    },
    isEnCours: (joueur) => {
        return joueur.tourEnCours;
    },
    isMJ: (joueur) => {
        return joueur.maitreDuJeu;
    },
    joueurs: ListeJoueurs.find(),
    tuPrends: (joueur) => {
        return joueur.tp;
    },
    tuDonnes: (joueur) => {
        const joueurSession = ListeJoueurs.find({pseudo: Session.get("pseudoSession")}).fetch()[0];
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