import {Template} from "meteor/templating";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import {getUnicode} from "../jeu/phasePreliminaire";


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
});