import {Meteor} from "meteor/meteor";

export const Jokers = new Mongo.Collection('jokers');

Jokers.allow({
    insert: function(){return true},
    update: function(){return true},
});

if (Meteor.isServer) {
    Meteor.publish('jokers', function () {
        return Jokers.find();
    });
}