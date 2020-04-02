import {Template} from "meteor/templating";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import {getUnicode} from "../jeu/phasePreliminaire";

const cards = require('cards');

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
        return couleur === "hearts" || couleur === "diamonds" || card.suit === cards.suits.none;
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
    score: chance,
});

Template.joueurs.events({
});