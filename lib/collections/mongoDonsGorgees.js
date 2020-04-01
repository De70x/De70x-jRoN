import {Meteor} from "meteor/meteor";

export const DonsGorgees = new Mongo.Collection('dons_gorgees');

DonsGorgees.allow({
    insert: function(){return true},
    update: function(){return true},
});

if (Meteor.isServer) {
    Meteor.publish('dons_gorgees', function () {
        return DonsGorgees.find();
    });
}