import {Template} from 'meteor/templating';
import '../../../lib/routes'
import {estMaitreDuJeu} from "./jeu";
import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";

Template.phaseZeroTemplate.onCreated(function () {
    Meteor.subscribe('cartes_centrales');
    Meteor.subscribe('cartes_tirees');
    Meteor.subscribe('joueurs');
    Meteor.subscribe('paquet');
    Meteor.subscribe('phase_en_cours');
    Meteor.subscribe('dons_gorgees');
    Meteor.subscribe('message');
});

Template.phaseZeroTemplate.helpers({
    estMJ: () => {
        return estMaitreDuJeu();
    },
    pasDeMJ: () => {
        return ListeJoueurs.find({maitreDuJeu:true}).count() === 0;
    },
});

Template.phaseZeroTemplate.events({
    'click #debuter'(event) {
        if(ListeJoueurs.find({maitreDuJeu:true}).count() !== 0 ) {
            debuterPartie();
        }
        else{
            alert("Point de jeu sans maître ! ");
        }
    },
    'click #mj'(event) {
        Meteor.call('choisirMJ', (error, result) => {
            if (error) {
                console.log(" Erreur dans debuterPartie : ");
                console.log(error);
            } else {
            }
        });
    },
    'click #reconnexion'(event) {
        Router.go("connexion");
    },
});

this.debuterPartie = () => {
    Meteor.call('changerPhase', "phase1", (error, result) => {
        if (error) {
            console.log(" Erreur dans debuterPartie : ");
            console.log(error);
        } else {
            Meteor.call('premierJoueur', (error, result) => {
                if (error) {
                    console.log(" Erreur dans debuterPartie : ");
                    console.log(error);
                } else {
                    Router.go('phase1');
                }
            });
        }
    });
};