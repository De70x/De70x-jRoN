import {Meteor} from "meteor/meteor";

export const ListeJoueurs = new Mongo.Collection('joueurs');

ListeJoueurs.allow({
    insert: function(){return true},
    update: function(){return true},
});

if (Meteor.isServer) {
    Meteor.publish('joueurs', function () {
        return ListeJoueurs.find();
    });
}