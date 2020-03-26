import {Template} from "meteor/templating";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";

const {Card} = require('cards');
const cards = require('cards');
import unicode from "cards/src/unicode"


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
        var suit;
        var rank;
        switch (carte[0].suit.name) {
            case 'spades':
                suit = cards.suits.spades;
                break;
            case 'hearts':
                suit = cards.suits.hearts;
                break;
            case 'diamonds':
                suit = cards.suits.diamonds;
                break;
            case 'clubs':
                suit = cards.suits.clubs;
                break;
            default:
                break;
        }
        switch (carte[0].rank.shortName) {
            case 'A':
                rank = cards.ranks.ace;
                break;
            case '2':
                rank = cards.ranks.two;
                break;
            case '3':
                rank = cards.ranks.three;
                break;
            case '4':
                rank = cards.ranks.four;
                break;
            case '5':
                rank = cards.ranks.five;
                break;
            case '6':
                rank = cards.ranks.six;
                break;
            case '7':
                rank = cards.ranks.seven;
                break;
            case '8':
                rank = cards.ranks.eight;
                break;
            case '9':
                rank = cards.ranks.nine;
                break;
            case '10':
                rank = cards.ranks.ten;
                break;
            case 'J':
                rank = cards.ranks.jack;
                break;
            case 'Q':
                rank = cards.ranks.queen;
                break;
            case 'K':
                rank = cards.ranks.king;
                break;
            default:
                break;
        }

        return unicode.unicodeCards.get(suit).get(rank);
    },
    isEnCours: (joueur) => {
        return joueur.tourEnCours;
    },
    joueurs: ListeJoueurs.find(),
});