import {Template} from 'meteor/templating';
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
// immport des template
import '../templates/phaseZero.html';
import '../templates/phasePreliminaire.html';
import '../templates/phaseFinale.html';
import '../templates/phaseDons.html';
import '../templates/joueurs.html';
import '../templates/menu.html';
import '../templates/connexion.html';
// HTML
import './jeu.html';
// JS
import '../joueur/connexion';
import '../../../lib/routes';
import '../jeu/phaseZero';
import '../jeu/phasePreliminaire';
import '../jeu/phaseFinale';
import '../jeu/phaseDons';
import '../joueur/joueurs';
import '../joueur/joueur';
import '../joueur/menu';

const screenfull = require('screenfull');

Template.body.onCreated(function () {
    Meteor.subscribe('cartes_centrales');
    Meteor.subscribe('cartes_tirees');
    Meteor.subscribe('joueurs');
    Meteor.subscribe('paquet');
    Meteor.subscribe('phase_en_cours');
    Meteor.subscribe('message');
});

Template.ApplicationLayout.events({
    'click .fullscreen'() {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    },
});

Template.ApplicationLayout.helpers({});

export const estMaitreDuJeu = () => {
    const joueursLocaux = ConnexionsLocales.find({_id: {$exists: true}}).fetch();
    let unJoueurLocalEstMJ = false;
    if (joueursLocaux === undefined) {
        return "nonMJ";
    }
    joueursLocaux.forEach(joueur => {
        const upperPseudo = joueur.pseudo.trim().toUpperCase();
        ListeJoueurs.find({_id: {$exists: true}}).fetch().forEach(joueurDB => {
            if (joueurDB.pseudo.trim().toUpperCase() === upperPseudo && joueurDB.maitreDuJeu === true) {
                unJoueurLocalEstMJ = true;
            }
        });
    });
    if (!unJoueurLocalEstMJ) {
        return "nonMJ";
    }

};

deleteAll = () => {
    Meteor.call('clearDB', (error, result) => {
        if (error) {
            console.log(" Erreur dans le delete total : ");
            console.log(error);
        } else {
            if (result === true) {
                Router.go("init");
            } else {

            }
        }
    });
};



