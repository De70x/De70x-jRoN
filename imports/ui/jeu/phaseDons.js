import {ListeJoueurs} from "../../../lib/collections/mongoJoueurs";
import {DonsGorgees} from "../../../lib/collections/mongoDonsGorgees";
import {getUnicode} from "./phasePreliminaire";
import {Message} from "../../../lib/collections/mongoMessage";

const screenfull = require('screenfull');
const cards = require('cards');

Template.phaseDonsTemplate.onCreated(() => {
    Meteor.subscribe('joueurs');
    Meteor.subscribe('dons_gorgees');
    Meteor.subscribe('message');
});

Template.phaseDonsTemplate.helpers({
    carteResolue: () => {
        let suit;
        let rank;
        if (Router.current().params !== undefined) {
            rank = new cards.Rank(Router.current().params.rangCarteShort, Router.current().params.rangCarteLong);
            switch (Router.current().params.couleurCarte) {
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
        }
        if (suit !== undefined && rank !== undefined) {
            return new cards.Card(suit, rank);
        } else {
            return new cards.Card(cards.suits.none, cards.ranks.joker);
        }

    },
    afficherCarte: (carte) => {
        let vRet;
        const debutRouge = "<span style=\"color:red;font-size:100px;\">";
        const debutNoir = "<span style=\"color:black;font-size:100px;\">";
        const fin = "</span>";
        if (carte.suit.name === "diamonds" || carte.suit.name === "hearts" || carte.suit === cards.suits.none) {
            vRet = debutRouge + getUnicode(carte) + fin;
        } else {
            vRet = debutNoir + getUnicode(carte) + fin;
        }
        return Spacebars.SafeString(vRet);
    },
    joueurQuiDonne: () => {
        if (DonsGorgees.find({donsEnCours: true}).count() === 0) {
            const nbDonneurs = DonsGorgees.find({_id: {$exists: true}}).count();
            const nbAleatoire = Math.floor(Math.random() * nbDonneurs);
            if (DonsGorgees.find({_id: {$exists: true}}).fetch()[nbAleatoire] !== undefined) {
                const idJoueur = DonsGorgees.find({_id: {$exists: true}}).fetch()[nbAleatoire];
                DonsGorgees.update({_id: idJoueur._id}, {$set: {donsEnCours: true}});
                return ListeJoueurs.findOne({_id: idJoueur.joueur});
            }
        } else {
            const donneurEnCours = DonsGorgees.findOne({donsEnCours: true});
            return ListeJoueurs.findOne({_id: donneurEnCours.joueur});
        }
    },
    tuDonnes: (joueur) => {
        if (DonsGorgees.findOne({donsEnCours: true}) !== undefined) {
            return joueur._id !== DonsGorgees.findOne({donsEnCours: true}).joueur;
        }
    },
    estDonneur: () => {
        const joueursLocaux = ConnexionsLocales.find({_id: {$exists: true}}).fetch();
        const donneurEnCours = DonsGorgees.findOne({donsEnCours: true});
        let estDonneur = "nonDonneur";
        if (donneurEnCours !== undefined) {
            const pseudoDonneur = ListeJoueurs.findOne({_id: donneurEnCours.joueur}).pseudo.trim().toUpperCase();
            joueursLocaux.forEach(joueur => {
                if (joueur.pseudo.trim().toUpperCase() === pseudoDonneur) {
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
    },
    message: () => {
        if (Message.findOne({don: "don"}) !== undefined) {
            return Message.findOne({don: "don"}).message;
        }
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
    'click #retourPhase2'() {
        $("#don").text("");
        Meteor.call('changerPhase', "phase2", (error) => {
            if (error) {
                console.log(" Erreur dans debuterPartie : ");
                console.log(error);
            } else {
                Router.go("phase2");
            }
        });

    }
});

export const donnerGorgees = (idEmmeteur, idDestinataire, nbGorgees) => {
    Meteor.call('donsGorgees', idEmmeteur, idDestinataire, nbGorgees, (error, result) => {
        if (error) {
            console.log(" Erreur dans donsGorgees : ");
            console.log(error);
        } else {
            Meteor.call('updateMessage', result, (error) => {
                if (error) {
                    console.log(" Erreur dans updateMessage : ");
                    console.log(error);
                } else {
                }
            });
        }
    });
};