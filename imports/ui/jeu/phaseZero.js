import {Template} from 'meteor/templating';
import {PhaseEnCours} from "../../../lib/collections/mongoPhaseEnCours";
import '../../../lib/routes'

const {decks} = require('cards');
export const jeu = new decks.StandardDeck();
jeu.shuffleAll();

Template.phaseZeroTemplate.helpers({
    isPhaseZero: () => {
        return PhaseEnCours.find({_id: {$exists: true}}).count() === 0;
    },
});


Template.phaseZeroTemplate.events({
    'click #debuter'(event) {
        Router.go('phase1');
        debuterPartie();
    },
});

this.debuterPartie = () => {
    Meteor.call('changerPhase', "phase0", (error, result) => {
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