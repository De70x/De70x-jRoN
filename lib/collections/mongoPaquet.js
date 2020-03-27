import {Meteor} from "meteor/meteor";

export const Paquet = new Mongo.Collection('paquet');

Paquet.allow({
    insert: function(){return true},
    update: function(){return true},
});

if (Meteor.isServer) {
    Meteor.publish('paquet', function () {
        return Paquet.find();
    });
}