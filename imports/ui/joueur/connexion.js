import '../templates/connexion.html';

const screenfull = require('screenfull');

ConnexionsLocales = new Mongo.Collection('connexionsLocales', {connection: null});
new PersistentMinimongo(ConnexionsLocales);


Template.connexionTemplate.onCreated(function () {
    Meteor.subscribe('joueurs');
    const instance = this;
    instance.connexion_failed = new ReactiveVar({});
});

Template.connexionTemplate.helpers({
});


Template.connexionTemplate.events({
    'submit #connexion'(event, instance) {
        event.preventDefault();
        if (event.target.pseudo.value.length > 1) {
            Meteor.call('insertJoueur', event.target.pseudo.value, (error, result) => {
                if (error) {
                    console.log(" Erreur dans ajouterJoueur" + error);
                } else {
                    if (result != null) {
                        insertJoueurLocal(event.target.pseudo.value);
                        Router.go("phase0");
                    } else {
                        $(".pseudoModale").text(event.target.pseudo.value);
                        $("#confirmer").val(event.target.pseudo.value);
                        $('#modaleErreurConnexion').modal('toggle');
                    }

                }
            });
        }
    },
    'click .fullscreen'(event) {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    },
    'click #confirmer'(event) {
        insertJoueurLocal(event.target.value);
        $('#modaleErreurConnexion').on('hidden.bs.modal', function () {
            Router.go("phase0");
        }).modal('hide');

    },
    'click #annuler'(event) {
        Router.go("phase0");
    },
});

function insertJoueurLocal(pseudo) {
    const joueursLocaux = ConnexionsLocales.find({_id: {$exists: true}}).fetch();
    let joueurLocalExistant = false;
    joueursLocaux.forEach(joueur => {
        if (joueur.pseudo.trim().toUpperCase() === pseudo.trim().toUpperCase()) {
            joueurLocalExistant = true;
        }
    });
    if (!joueurLocalExistant) {
        ConnexionsLocales.insert({pseudo: pseudo});
    }
}



