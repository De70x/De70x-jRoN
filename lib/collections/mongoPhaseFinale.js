import {Meteor} from "meteor/meteor";

export const CartesCentrales = new Mongo.Collection('cartes_centrales');

CartesCentrales.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
});

if (Meteor.isServer) {
    Meteor.publish('cartes_centrales', function () {
        return CartesCentrales.find();
    });
}