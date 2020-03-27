import './connexion.html';
import { Session } from 'meteor/session'

Template.connexion.onCreated(function () {
    Meteor.subscribe('joueurs')
});

this.ajouterJoueur = (pseudo) => {
    Meteor.call('insertJoueur', pseudo, (error, result) => {
        if (error) {
            console.log(" Erreur dans ajouterJoueur" + error);
        } else {
            if (result === true) {
                console.log(pseudo + " A bien été ajouté ! ");
                Session.set('pseudoSession', pseudo);
            } else {
                // Affichier un message pour prévenir l'utilisateur
            }
        }
    });
    Meteor.call('choisirMJ', (error, result) => {
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
        }
    },
});

Template.deconnexion.events({
    'submit #deconnexion'(event) {
        event.preventDefault();
        supprimerJoueur(Session.get('pseudoSession'));
    },
});



