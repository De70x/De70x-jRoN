import {PhaseEnCours} from "./collections/mongoPhaseEnCours";
import {DonsGorgees} from "./collections/mongoDonsGorgees";
import {Paquet} from "./collections/mongoPaquet";
import {ListeJoueurs} from "./collections/mongoJoueurs";

const {decks} = require('cards');

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
        //TODO mettre ça ailleur car si on se deco et qu'on revient sur l'URL / on supprime les connexions locales mais pas la base. du coup on ne peut pas se reconnecter avec le même pseudo
        ConnexionsLocales.remove({});
        if (deconnecte()) {
            Router.go("connexion");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase1") {
            Router.go("phase1");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase2") {
            Router.go("phase2");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phaseDons") {
            if (DonsGorgees.find({}).fetch()[0] !== undefined) {
                const carteEnCours = DonsGorgees.find({}).fetch()[0].carte;
                Router.go("phaseDons", {
                    rangCarteShort: carteEnCours.rank.shortName,
                    rangCarteLong: carteEnCours.rank.longName,
                    couleurCarte: carteEnCours.suit.name
                });
            } else {
                Router.go("phaseDons", {rangCarteShort: null, rangCarteLong: null, couleurCarte: null});
            }
        } else {
            Router.go("phase0");
        }
    },
    {
        name: 'init'
    }
);

Router.route('/connexion', function () {
        this.layout('connexionTemplate');
        this.render('connexionTemplate');
    },
    {
        name: 'connexion'
    }
);

Router.route('/inscriptions', function () {
        if (deconnecte()) {
            Router.go("connexion");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase1") {
            Router.go("phase1");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase2") {
            Router.go("phase2");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phaseDons") {
            if (DonsGorgees.find({}).fetch()[0] !== undefined) {
                const carteEnCours = DonsGorgees.find({}).fetch()[0].carte;
                Router.go("phaseDons", {
                    rangCarteShort: carteEnCours.rank.shortName,
                    rangCarteLong: carteEnCours.rank.longName,
                    couleurCarte: carteEnCours.suit.name
                });
            } else {
                Router.go("phaseDons", {rangCarteShort: null, rangCarteLong: null, couleurCarte: null});
            }
        }
        this.render('phaseZeroTemplate');
    },
    {
        name: 'phase0'
    }
);

Router.route('/phase1', function () {
        initPaquet();
        if (deconnecte()) {
            Router.go("connexion");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase2") {
            Router.go("phase2");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) === undefined) {
            Router.go("phase0");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phaseDons") {
            if (DonsGorgees.find({}).fetch()[0] !== undefined) {
                const carteEnCours = DonsGorgees.find({}).fetch()[0].carte;
                Router.go("phaseDons", {
                    rangCarteShort: carteEnCours.rank.shortName,
                    rangCarteLong: carteEnCours.rank.longName,
                    couleurCarte: carteEnCours.suit.name
                });
            } else {
                Router.go("phaseDons", {rangCarteShort: null, rangCarteLong: null, couleurCarte: null});
            }
        }
        this.render('phasePreliminaireTemplate');
    },
    {
        name: 'phase1'
    }
);

Router.route('/phase2', function () {
        if (deconnecte()) {
            Router.go("connexion");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase1") {
            Router.go("phase1");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) === undefined) {
            Router.go("phase0");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phaseDons") {
            if (DonsGorgees.find({}).fetch()[0] !== undefined) {
                const carteEnCours = DonsGorgees.find({}).fetch()[0].carte;
                Router.go("phaseDons", {
                    rangCarteShort: carteEnCours.rank.shortName,
                    rangCarteLong: carteEnCours.rank.longName,
                    couleurCarte: carteEnCours.suit.name
                });
            } else {
                Router.go("phaseDons", {rangCarteShort: null, rangCarteLong: null, couleurCarte: null});
            }
        }
        this.render('phaseFinaleTemplate');
    },
    {
        name: 'phase2'
    }
);

Router.route('/phaseDons/:rangCarteShort/:rangCarteLong/:couleurCarte', function () {
        if (deconnecte()) {
            Router.go("connexion");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) === undefined) {
            Router.go("phase0");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase1") {
            Router.go("phase1");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase2") {
            Router.go("phase2");
        } else {
            this.layout('phaseDonsTemplate');
            this.render('phaseDonsTemplate');
        }
    },
    {
        name: 'phaseDons'
    }
);

function initPaquet() {
    if (Paquet.find({_id: {$exists: true}}).count() === 0) {
        const nbJoueurs = ListeJoueurs.find({_id: {$exists: true}}).count();
        const nbPaquetsSupp = Math.floor((nbJoueurs - 1) / 10);
        for (let i = 0; i < nbPaquetsSupp + 1; i++) {
            const jeuSupp = new decks.StandardDeck();
            jeuSupp.shuffleAll();
            jeuSupp.draw(52).forEach(carte => {
                Paquet.insert({carte: carte});
            });
        }
    }
}

function deconnecte() {
    return ConnexionsLocales.find({_id: {$exists: true}}).count() === 0;
}