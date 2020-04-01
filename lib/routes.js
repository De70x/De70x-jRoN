import {initPaquet} from "../imports/ui/jeu/jeu";
import {deconnecte} from "../imports/ui/joueur/connexion";
import {PhaseEnCours} from "./collections/mongoPhaseEnCours";
import {DonsGorgees} from "./collections/mongoDonsGorgees";

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
            Router.go("phaseDons");
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
            Router.go("phaseDons");
        }
        this.render('phaseZeroTemplate');
    },
    {
        name: 'phase0'
    }
);

Router.route('/phase1', function () {
        if (deconnecte()) {
            Router.go("connexion");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phase2") {
            Router.go("phase2");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) === undefined) {
            Router.go("phase0");
        } else if (PhaseEnCours.findOne({_id: {$exists: true}}) !== undefined && PhaseEnCours.findOne({_id: {$exists: true}}).phase === "phaseDons") {
            Router.go("phaseDons");
        }
        initPaquet();
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
            Router.go("phaseDons");
        }
        this.render('phaseFinaleTemplate');
    },
    {
        name: 'phase2'
    }
);

Router.route('/phaseDons/:rangCarteShort/:rangCarteLong/:couleurCarte', function () {
        this.layout('phaseDonsTemplate');
        this.render('phaseDonsTemplate');
    },
    {
        name: 'phaseDons'
    }
);

