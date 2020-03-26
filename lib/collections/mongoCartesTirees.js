import {Meteor} from "meteor/meteor";

export const CartesTirees = new Mongo.Collection('cartes_tirees');

CartesTirees.allow({
    insert: function(){return true}
});

if (Meteor.isServer) {
    Meteor.publish('cartes_tirees', function () {
        return CartesTirees.find();
    });
}