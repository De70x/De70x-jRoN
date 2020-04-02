import {Meteor} from "meteor/meteor";

export const Message = new Mongo.Collection('message');

Message.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
});

if (Meteor.isServer) {
    Meteor.publish('message', function () {
        return Message.find();
    });
}