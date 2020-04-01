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
    erreurConnexion:()=>{
        console.log(Template.instance().connexion_failed.get());
        return Template.instance().connexion_failed.get();
    }
});

Template.connexionTemplate.events({
    'submit #connexion'(event, instance) {
        event.preventDefault();
        if (event.target.pseudo.value.length > 1) {
            Meteor.call('insertJoueur', event.target.pseudo.value, (error, result) => {
                if (error) {
                    console.log(" Erreur dans ajouterJoueur" + error);
                } else {
                    if(result != null) {
                        ConnexionsLocales.insert({pseudo: event.target.pseudo.value});
                        Router.go("phase0");
                    }
                    else{
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
    'click #confirmer'(event){
        const joueursLocaux = ConnexionsLocales.find({_id:{$exists: true}}).fetch();
        let joueurLocalExistant = false;
        joueursLocaux.forEach(joueur => {
            joueurLocalExistant = joueur.pseudo === event.target.value;
        });
        if(!joueurLocalExistant) {
            ConnexionsLocales.insert({pseudo: event.target.value});
        }
        $('#modaleErreurConnexion').on('hidden.bs.modal', function() {
            Router.go("phase0");
        }).modal('hide');

    },
});

export const deconnecte = () => {
    return ConnexionsLocales.find({_id:{$exists:true}}).count() === 0 ;
};




