import {Template} from 'meteor/templating';
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import {Session} from 'meteor/session';
const screenfull = require('screenfull');

// immport des template
import '../templates/phaseZero.html';
import '../templates/phasePreliminaire.html';
import '../templates/phaseFinale.html';
import '../templates/phaseDons.html';
import '../templates/joueurs.html';
import '../templates/menu.html';
import '../templates/connexion.html';


const {decks} = require('cards');

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


import {Paquet} from "../../../lib/collections/mongoPaquet";

Template.body.onCreated(function () {
    Meteor.subscribe('cartes_centrales');
    Meteor.subscribe('cartes_tirees');
    Meteor.subscribe("jokers");
    Meteor.subscribe('joueurs');
    Meteor.subscribe('paquet');
    Meteor.subscribe('phase_en_cours');
});

Template.ApplicationLayout.events({
    'click .fullscreen'(event) {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    },
});

Template.ApplicationLayout.helpers({
});

export const estMaitreDuJeu = () => {
    const joueursLocaux = ConnexionsLocales.find({_id:{$exists:true}}).fetch();
    let unJoueurLocalEstMJ = false;
    if (joueursLocaux === undefined) {
        return "nonMJ";
    }
    joueursLocaux.forEach(joueur => {
        const joueurDB = ListeJoueurs.findOne({pseudo: joueur.pseudo});
        if (joueurDB !== undefined && joueurDB.maitreDuJeu) {
            unJoueurLocalEstMJ = true;
        }
    });
    if (!unJoueurLocalEstMJ) {
        return "nonMJ";
    }

};

deleteAll = () => {
    Session.set("pseudoSession", undefined);
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

export const initPaquet = () => {
    const nbJoueurs = ListeJoueurs.find({_id:{$exists: true}}).count();
    const nbPaquetsSupp = Math.floor((nbJoueurs-1)/10);
    for(let i=0; i< nbPaquetsSupp+1; i++){
        const jeuSupp = new decks.StandardDeck();
        jeuSupp.shuffleAll();
        jeuSupp.draw(52).forEach(carte=>{
            Paquet.insert({carte:carte});
        });
    }
};

