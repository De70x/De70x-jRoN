import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import {DonsGorgees} from "../../../lib/collections/mongoDonsGorgees";
import {getUnicode} from "./phasePreliminaire";

const screenfull = require('screenfull');
const cards = require('cards');

Template.phaseDonsTemplate.onCreated(() => {
    Meteor.subscribe('joueurs');
    Meteor.subscribe('dons_gorgees');
});

Template.phaseDonsTemplate.helpers({
    carteResolue : () => {
        let suit;
        switch (Router.current().params.couleurCarte){
            case "spades":
                suit = cards.suits.spades;
                break;
            case "hearts":
                suit = cards.suits.hearts;
                break;
            case "diamonds":
                suit = cards.suits.diamonds;
                break;
            case "clubs":
                suit = cards.suits.clubs;
                break;
        }
        const carte = new cards.Card(suit, new cards.Rank(Router.current().params.rangCarteShort, Router.current().params.rangCarteLong));
        return carte;
    },
    afficherCarte:(carte) => {
        let vRet;
        const debutRouge = "<span style=\"color:red;font-size:100px;\">";
        const debutNoir = "<span style=\"color:black;font-size:100px;\">";
        const fin = "</span>";
        if (carte.suit.name === "diamonds" || carte.suit.name === "hearts") {
            vRet = debutRouge + getUnicode(carte) + fin;
        } else {
            vRet = debutNoir + getUnicode(carte) + fin;
        }
        return Spacebars.SafeString(vRet);
    },
    joueurQuiDonne: () => {
        if(DonsGorgees.find({donsEnCours:true}).count() === 0){
            const nbDonneurs = DonsGorgees.find({_id: {$exists: true}}).count();
            const nbAleatoire = Math.floor(Math.random() * nbDonneurs);
            if(DonsGorgees.find({_id: {$exists: true}}).fetch()[nbAleatoire] !== undefined){
                const idJoueur = DonsGorgees.find({_id: {$exists: true}}).fetch()[nbAleatoire];
                DonsGorgees.update({_id:idJoueur._id}, {$set:{donsEnCours:true}});
                return ListeJoueurs.findOne({_id:idJoueur.joueur});
            }
        }
        else{
            const donneurEnCours = DonsGorgees.findOne({donsEnCours:true});
            return ListeJoueurs.findOne({_id:donneurEnCours.joueur});
        }
    },
    tuDonnes: (joueur) => {
        if(DonsGorgees.findOne({donsEnCours:true}) !== undefined) {
            return joueur._id !== DonsGorgees.findOne({donsEnCours: true}).joueur;
        }
    },
    estDonneur:() => {
        const joueursLocaux = ConnexionsLocales.find({_id:{$exists:true}}).fetch();
        const donneurEnCours = DonsGorgees.findOne({donsEnCours:true});
        let estDonneur="nonDonneur";
        if (donneurEnCours !== undefined) {
            const pseudoDonneur = ListeJoueurs.findOne({_id: donneurEnCours.joueur}).pseudo;
            joueursLocaux.forEach(joueur => {
                if (joueur.pseudo === pseudoDonneur) {
                    estDonneur = "";
                }
            });
        }
        return estDonneur;
    },
    gorgeesMax: () => {
        const donneurEnCours = DonsGorgees.findOne({donsEnCours: true});
        const nbGorgees = ListeJoueurs.findOne({_id: donneurEnCours.joueur}).nbGorgeesD;
        if (nbGorgees % 5 === 0) {
            return nbGorgees / 5;
        }
        return nbGorgees;
    },
    plusDeDons: () => {
        return DonsGorgees.find({_id: {$exists: true}}).count() === 0;
    },
    joueurs: () => {
        return ListeJoueurs.find({_id: {$exists: true}});
    },
    culSec: () => {
        const donneurEnCours = DonsGorgees.findOne({donsEnCours: true});
        if (donneurEnCours !== undefined) {
            return ListeJoueurs.findOne({_id: donneurEnCours.joueur}).nbGorgeesD % 5 === 0;
        }
    },
    nbCulsSecs: () => {
        const donneurEnCours = DonsGorgees.findOne({donsEnCours: true});
        return ListeJoueurs.findOne({_id: donneurEnCours.joueur}).nbGorgeesD / 5;
    }
});

Template.phaseDonsTemplate.events({
    'submit .donsGorgees'(event) {
        event.preventDefault();
        const idEmmeteur = DonsGorgees.findOne({donsEnCours: true}).joueur;
        const idDestinataire = event.target.destinataire.value;
        const nbGorgees = event.target.gorgees.value;
        const nbGorgeesTotal = ListeJoueurs.findOne({_id: idEmmeteur}).nbGorgeesD;
        if (nbGorgeesTotal % 5 === 0) {
            donnerGorgees(idEmmeteur, idDestinataire, nbGorgees * 5);
        } else {
            donnerGorgees(idEmmeteur, idDestinataire, nbGorgees);
        }
    },
    'click #banzai'(event) {
        const nbGorgeesTotal = ListeJoueurs.findOne({_id: event.target.value}).nbGorgeesD;
        if (nbGorgeesTotal % 5 === 0) {
            donnerGorgees(event.target.value, event.target.value, 5);
        } else {
            donnerGorgees(event.target.value, event.target.value, 1);
        }
    },
    'click .fullscreen'() {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    },
    'click #retourPhase2'(){
        $('#don').text("");
        Router.go("phase2");
    }
});

export const donnerGorgees = (idEmmeteur, idDestinataire, nbGorgees) =>{
    Meteor.call('donsGorgees', idEmmeteur, idDestinataire, nbGorgees, (error, result) => {
        if (error) {
            console.log(" Erreur dans joueurSuivant : ");
            console.log(error);
        } else {
            $("#don").text(result);
            // S'il n'y a plus de dons à faire, on peut revenir en phase 2
            if(DonsGorgees.find({_id:{$exists:true}}).count() === 0){
                Meteor.call('changerPhase', "phase2", (error, result) => {
                    if (error) {
                        console.log(" Erreur dans debuterPartie : ");
                        console.log(error);
                    } else {
                    }
                });
            }
        }
    });
};