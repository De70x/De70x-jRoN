import {Template} from 'meteor/templating';
import {CartesCentrales} from "../../../lib/collections/mongoCartesCentrales";
import unicode from "cards/src/unicode"
import {getUnicode} from "./phasePreliminaire";
import {estMaitreDuJeu} from "./jeu";

let mapFinale = new Map();
mapFinale.set('tp1', 0);
mapFinale.set('td1', 1);
mapFinale.set('tp2', 2);
mapFinale.set('td2', 3);
mapFinale.set('tp3', 4);
mapFinale.set('td3', 5);
mapFinale.set('tp4', 6);
mapFinale.set('td4', 7);
mapFinale.set('tmp', 8);
mapFinale.set('tmd', 9);


Template.phaseFinaleTemplate.onCreated(() => {
    Meteor.subscribe('joueurs');
    Meteor.subscribe('cartes_centrales');
});

Template.phaseFinaleTemplate.helpers({
    dosPaquet: unicode.back,
    afficheCarte: (carteCentrale) => {
        // Si la carte n'est pas encore retournée
        if (carteCentrale===undefined || !carteCentrale.retournee) {
            return unicode.back;
        } else {
            let vRet;
            const debutRouge = "<span style=\"color:red;font-size:100px;\">";
            const debutNoir = "<span style=\"color:black;font-size:100px;\">";
            const fin = "</span>";

            if (carteCentrale.carte.suit.name === "diamonds" || carteCentrale.carte.suit.name === "hearts") {
                vRet = debutRouge + getUnicode(carteCentrale.carte) + fin;
            } else {
                vRet = debutNoir + getUnicode(carteCentrale.carte) + fin;
            }
            return Spacebars.SafeString(vRet);
        }
    },
    tuMegaPrends: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[8];
        }
    },
    tuMegaDonnes: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[9];
        }
    },
    tp1: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[0];
        }
    },
    td1: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[1];
        }
    },
    tp2: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[2];
        }
    },
    td2: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[3];
        }
    },
    tp3: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[4];
        }
    },
    td3: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[5];
        }
    },
    tp4: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[6];
        }
    },
    td4: () => {
        if (CartesCentrales.find({_id: {$exists: true}}).fetch() !== undefined) {
            return CartesCentrales.find({_id: {$exists: true}}).fetch()[7];
        }
    },
    finDeChantier: () => {
        const derniereCarteFinale = CartesCentrales.find({_id: {$exists: true}}).fetch()[9];
        if (derniereCarteFinale !== undefined) {
            return derniereCarteFinale.retournee;
        }
    },
    estMaitreDuJeu: () => {
        return estMaitreDuJeu();
    },
});

Template.phaseFinaleTemplate.events({
    'click .carteFinale'(event) {
        let numeroTirage = mapFinale.get(event.target.id);
        let carte = CartesCentrales.find({numeroTirage: numeroTirage}).fetch()[0];
        console.log(carte);
        if (carte.retournable) {
            console.log(event.target.id);
            Meteor.call('nextCarte', numeroTirage, (error, result) => {
                if (error) {
                    console.log(" Erreur lors du clique sur une carte finale : ");
                    console.log(error);
                } else {
                    if (result === true) {

                    } else {
                    }
                }
            });
        }
    },
    'click #dosPaquetFinal'(event) {
        const carteTiree = jeu2.draw(1)[0];
        Meteor.call('repioche', carteTiree, (error, result) => {
            if (error) {
                console.log(" Erreur dans le delete total : ");
                console.log(error);
            } else {
                if (result === true) {
                } else {

                }
            }
        });
    },
    'click #terminer'(event) {
        Meteor.call('restart', (error, result) => {
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
    },
});


