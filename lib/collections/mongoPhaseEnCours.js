import {Meteor} from "meteor/meteor";

export const PhaseEnCours = new Mongo.Collection('phase_en_cours');

PhaseEnCours.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
});

if (Meteor.isServer) {
    Meteor.publish('phase_en_cours', function () {
        return PhaseEnCours.find();
    });
}