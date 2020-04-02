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
mapFinale.set('tp5', 8);
mapFinale.set('td5', 9);

const tp = ['tp1', 'tp2', 'tp3', 'tp4', 'tp5'];
const td = ['td1', 'td2', 'td3', 'td4', 'td5'];


Template.phaseFinaleTemplate.onCreated(() => {
    Meteor.subscribe('cartes_centrales');
    Meteor.subscribe('cartes_tirees');
    Meteor.subscribe('joueurs');
    Meteor.subscribe('paquet');
    Meteor.subscribe('phase_en_cours');
    Meteor.subscribe('dons_gorgees');
});

Template.phaseFinaleTemplate.helpers({
    dosPaquet: unicode.back,
    afficheCarte: (carteCentrale) => {
        // Si la carte n'est pas encore retournée
        if (carteCentrale === undefined || !carteCentrale.retournee) {
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
    estMJ: () => {
        return estMaitreDuJeu();
    },
});

Template.phaseFinaleTemplate.events({
    'click .carteFinale'(event) {
        let numeroTirage = mapFinale.get(event.target.id);
        let carte = CartesCentrales.find({numeroTirage: numeroTirage}).fetch()[0];
        if (carte.retournable) {
            Meteor.call('nextCarte', numeroTirage, (error, result) => {
                if (error) {
                    console.log(" Erreur lors du clique sur une carte finale : ");
                    console.log(error);
                } else {
                    let prendsOuDonnes;
                    let nbGorgees = event.target.id.substring(2);
                    if (tp.includes(event.target.id)) {
                        prendsOuDonnes = "prends";
                    }
                    if (td.includes(event.target.id)) {
                        prendsOuDonnes = "donnes";
                    }
                    resolution(carte.carte, prendsOuDonnes, nbGorgees);
                }
            });
        }
    },
    'click #dosPaquetFinal'(event) {
        let carteTiree;
        Meteor.call('piocher', 1, (error, result) => {
            if (error) {
                console.log(" Erreur dans le delete total : ");
                console.log(error);
            } else {
                carteTiree = result[0].carte;
                Meteor.call('repioche', carteTiree, (error, result) => {
                    if (error) {
                        console.log(" Erreur dans le delete total : ");
                        console.log(error);
                    } else {
                        let prendsOuDonnes;
                        let nbGorgees;
                        if (result % 2 === 0) {
                            nbGorgees = (result + 2) / 2;
                            prendsOuDonnes = "prends";
                        }
                        if (result % 2 === 1) {
                            nbGorgees = (result + 1) / 2;
                            prendsOuDonnes = "donnes";
                        }
                        resolution(carteTiree, prendsOuDonnes, nbGorgees);
                    }
                });
            }
        });


    },
    'click #terminer'(event) {
        Meteor.call('clearDB', (error, result) => {
            if (error) {
                console.log(" Erreur dans le delete total : ");
                console.log(error);
            } else {
                Router.go("init");
            }
        });
    },
});

export const resolution = (carte, prendsOuDonnes, nbGorgees) => {
    Meteor.call('resolution', carte, prendsOuDonnes, nbGorgees, (error, result) => {
        if (error) {
            console.log(" Erreur dans le delete total : ");
            console.log(error);
        } else {
            if (result === "donsAFaire") {
                Meteor.call('changerPhase', "phaseDons", (error, result) => {
                    if (error) {
                        console.log(" Erreur dans joueurSuivant : ");
                        console.log(error);
                    } else {
                        Router.go("phaseDons", {
                            rangCarteShort: carte.rank.shortName,
                            rangCarteLong: carte.rank.longName,
                            couleurCarte: carte.suit.name,
                        });
                    }
                });
            }
        }
    });
};

