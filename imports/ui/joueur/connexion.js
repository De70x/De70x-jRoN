import './connexion.html';
import { Session } from 'meteor/session'

ConnexionsLocales = new Mongo.Collection('connexionsLocales', {connection: null});
export const ConnexionsPersistees = new PersistentMinimongo(ConnexionsLocales);

Template.connexion.onCreated(function () {
    Meteor.subscribe('joueurs')
});

this.ajouterJoueur = (pseudo) => {
    Session.set("pseudoSession", pseudo);
    Meteor.call('insertJoueur', pseudo, (error, result) => {
        if (error) {
            console.log(" Erreur dans ajouterJoueur" + error);
        } else {
            if (result === true) {
            } else {
                // Affichier un message pour prévenir l'utilisateur
            }
        }
    });
};

this.supprimerJoueur = (pseudo) => {
    Meteor.call('deleteJoueur', pseudo, (error, result) => {
        if (error) {
            console.log(" Erreur dans supprimerJoueur" + error);
        } else {
            if (result === true) {
                console.log(pseudo + " A bien été supprimé ! ");
                Session.set('pseudoSession', undefined);
            } else {
                // Affichier un message pour prévenir l'utilisateur
            }
        }
    });
};

Template.connexion.events({
    'submit #connexion'(event) {
        event.preventDefault();
        if (event.target.pseudo.value.length > 1) {
            ajouterJoueur(event.target.pseudo.value);
            ConnexionsLocales.insert({pseudo:event.target.pseudo.value});

        }
    },
});

Template.deconnexion.events({
    'submit #deconnexion'(event) {
        event.preventDefault();
        supprimerJoueur(Session.get('pseudoSession'));
    },
    'click #terminer'(event) {
        Meteor.call('restart', (error, result) => {
            if (error) {
                console.log(" Erreur dans le delete total : ");
                console.log(error);
            } else {
                if (result === true) {
                    Router.go("phase0");
                } else {
                }
            }
        });
    },
});



