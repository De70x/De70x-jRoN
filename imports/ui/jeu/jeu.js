import {Template} from 'meteor/templating';
import {PhaseEnCours} from "../../../lib/collections/mongoPhaseEnCours";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import { Session } from 'meteor/session'

// HTML
import './jeu.html';
import '../joueur/joueurs.html';
import '../joueur/connexion.html';

// JS
import '../joueur/connexion';
import '../../../lib/routes';
import '../jeu/phaseZero';
import '../jeu/phasePreliminaire';
import '../jeu/phaseFinale';
import '../joueur/joueurs'
import '../joueur/joueur'

Template.body.onCreated(function () {
    Meteor.subscribe('phase_en_cours');
});

Template.body.events({
});

Template.ApplicationLayout.helpers({
    phase: () => {
        let phaseEnCours = PhaseEnCours.find({_id: {$exists: true}}, {fields: {'phase': 1}}).fetch();
        console.log(phaseEnCours[0]);
        if (phaseEnCours[0] !== undefined) {
            if(phaseEnCours[0].phase === "phase1"){
                Router.go("phase1");
            }
            if(phaseEnCours[0].phase === "phase2"){
                Router.go("phase2");
            }
            return phaseEnCours[0].phase;
        } else {
            Router.go("phase0");
            return "Initialisation";
        }
    },
    personnesConnectees:() =>{
        let vRet = "";
        const personneConnectee = ConnexionsLocales.find({}).fetch()[0];
        vRet += personneConnectee.pseudo;
        return vRet
    },
});

Template.estConnecte.helpers({
    estConnecte: () => {
        var pseudoSession = Session.get('pseudoSession');
        return pseudoSession !== undefined;
    },
});

export const estMaitreDuJeu = () => {
        const joueurSession = Session.get("pseudoSession");
        if(joueurSession === undefined){
            return "nonMJ";
        }
        const joueurDB = ListeJoueurs.find({pseudo:joueurSession}).fetch()[0];
        if(joueurDB !== undefined && !joueurDB.maitreDuJeu){
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
                Router.go("phase0");
            } else {

            }
        }
    });
};

