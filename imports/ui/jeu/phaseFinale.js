import {Template} from 'meteor/templating';
import {CartesCentrales} from "../../../lib/collections/mongoPhaseFinale";
import {PhaseEnCours} from "../../../lib/collections/mongoPhaseEnCours";
import {jeu} from "./phaseZero";

Template.phaseFinaleTemplate.onCreated(() => {
    Meteor.subscribe('joueurs');
    Meteor.subscribe('cartes_centrales');
});

Template.body.helpers({
    isPhaseFinale: () => {
        let phaseEnCours = PhaseEnCours.find().fetch();
        return phaseEnCours !== undefined && phaseEnCours[0] !== undefined && phaseEnCours[0].phase === "phaseFinale";
    },
});

Template.phaseFinaleTemplate.helpers({});


// Au début, on n'affiche que les dos de cartes
// toutes en noir, sauf celle sur laquelle il faut cliquer
// dans l'ordre tp1 => td1 => tp2 => td2... jusqu'à mp => md FIN DU JEU

