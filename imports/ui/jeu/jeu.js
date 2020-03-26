import {Template} from 'meteor/templating';

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

});


Template.estConnecte.helpers({
    estConnecte: () => {
        var pseudoSession = Session.get('pseudoSession');
        return pseudoSession !== undefined;
    },
});

