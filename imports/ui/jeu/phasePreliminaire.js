import {Template} from "meteor/templating";

import {CartesTirees} from "../../../lib/collections/mongoCartesTirees";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import unicode from "cards/src/unicode"
import {CartesCentrales} from "../../../lib/collections/mongoCartesCentrales";
import {estMaitreDuJeu} from "./jeu";
import {CarteCentrale} from "../carte/carteCentrale";

const cards = require('cards');

Template.phasePreliminaireTemplate.onCreated(() => {
    Meteor.subscribe('cartes_tirees');
    Meteor.subscribe('cartes_centrales');
    Meteor.subscribe('paquet');
    Meteor.subscribe('joueurs');
});

Template.phasePreliminaireTemplate.helpers({
    isRed: (carte) => {
        return carte.suit.name === "hearts" || carte.suit.name === "diamonds"
    },
    derniereCarteExiste: () => {
        return CartesTirees.find().count() > 0;
    },
    dosPaquet: unicode.back,
    derniereCarte: () => {
        var nbCartesTirees = CartesTirees.find({_id: {$exists: true}}).count();
        return CartesTirees.findOne({'numeroTirage': nbCartesTirees}).carte[0];
    },
    getUnicode: (carte) => {
        return getUnicode(carte);
    },
    estMaitreDuJeu: () => {
        return estMaitreDuJeu();
    },
});

Template.phasePreliminaireTemplate.events({
    'click #dosPaquet'(event) {
        // On pioche une carte
        const carteTiree = jeu2.draw();
        // On met la carte en base
        tirerCarte(carteTiree);
        // On l'ajoute au joueur en cours
        var joueurEnCours = ListeJoueurs.findOne({tourEnCours: true}, {fields: {'_id': 1}, limit: 1});
        piocherCarte(carteTiree, joueurEnCours);
        // On passe au joueur suivant;
        joueurSuivant();
    },
});

// Cette méthode permet d'affiche la carte à côté du paquet
this.tirerCarte = (carte) => {
    Meteor.call('insertCarte', carte, (error, result) => {
        if (error) {
            console.log(" Erreur dans tirerCarte");
            console.log(error);
        } else {
            if (result === true) {
            } else {
                // Affichier un message pour prévenir l'utilisateur
            }
        }
    });
};

// Cette méthode ajoute la carte au joueur qui possède l'id en paramètre
this.piocherCarte = (carte, id) => {
    Meteor.call('insertCarteJoueur', carte, id, (error, result) => {
        if (error) {
            console.log(" Erreur dans piocherCarte : ");
            console.log(error);
        } else {
            if (result === true) {
            } else {
                // Affichier un message pour prévenir l'utilisateur
            }
        }
    });
};

// Cette méthode permet de passer au joueur suivant
this.joueurSuivant = () => {
    Meteor.call('nextJoueur', (error, result) => {
        if (error) {
            console.log(" Erreur dans joueurSuivant : ");
            console.log(error);
        } else {
            if (result === true) {
                console.log("On passe au suivant");
            } else {
                if (CartesCentrales.find({_id: {$exists: true}}).count() === 0) {
                    const cartesCentralesFinale = []
                    let i = 0;
                    jeu2.draw(10).forEach(carte => {
                        cartesCentralesFinale.push(new CarteCentrale(carte,i));
                        i++;
                    });
                    Meteor.call('prepaPhaseFinale', cartesCentralesFinale, (error, result) => {
                        if (error) {
                            console.log(" Erreur dans prepaPhaseFinale : ");
                            console.log(error);
                        } else {
                            if (result === true) {

                            } else {
                            }
                        }
                    });
                }
                Meteor.call('changerPhase', "phase2", (error, result) => {
                    if (error) {
                        console.log(" Erreur dans joueurSuivant : ");
                        console.log(error);
                    } else {
                        if (result === true) {
                            console.log("On passe au suivant");
                        } else {
                            // Affichier un message pour prévenir l'utilisateur
                        }
                    }
                });
                Router.go('phase2');
            }
        }
    });
};

export const getUnicode = (carte) => {
    var suit;
    var rank;
    switch (carte.suit.name) {
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
    switch (carte.rank.shortName) {
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
};