import {Template} from 'meteor/templating';
import '../../../lib/routes'
import {estMaitreDuJeu} from "./jeu";

const {decks} = require('cards');

Template.phaseZeroTemplate.onCreated(function () {
    Meteor.subscribe('joueurs');
    Meteor.subscribe('paquet');
});

Template.phaseZeroTemplate.helpers({
    estMaitreDuJeu: () => {
        return estMaitreDuJeu();
    },
});

Template.phaseZeroTemplate.events({
    'click #debuter'(event) {
        Router.go('phase1');
        debuterPartie();
    },
});

this.debuterPartie = () => {
    const paquet = new decks.StandardDeck();
    paquet.shuffleAll();
    jeu2 = paquet;
    Meteor.call('changerPhase', "phase1", (error, result) => {
        if (error) {
            console.log(" Erreur dans debuterPartie : ");
            console.log(error);
        } else {
            if (result === true) {
            } else {

            }
        }
    });
};