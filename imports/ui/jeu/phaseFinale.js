import {Template} from 'meteor/templating';
import {CartesCentrales} from "../../../lib/collections/mongoPhaseFinale";
import {PhaseEnCours} from "../../../lib/collections/mongoPhaseEnCours";

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

// Cette méthode permet de passer à la phase 2 du jeu
// On n'affiche plus la phase 1
// On affiche la phase 2
export const phaseFinale = () => {
    var cartesCentrales = jeu.draw(10);

    Meteor.call('phaseFinale', cartesCentrales, (error, result) => {
        if (error) {
            console.log(" Erreur dans joueurSuivant : ");
            console.log(error);
        } else {
            if (result === true) {
                console.log("On passe au suivant");
            } else {
                // Affichier un message pour prévenir l'utilisateur
            }
        }
    });
};

// Au début, on n'affiche que les dos de cartes
// toutes en noir, sauf celle sur laquelle il faut cliquer
// dans l'ordre tp1 => td1 => tp2 => td2... jusqu'à mp => md FIN DU JEU

