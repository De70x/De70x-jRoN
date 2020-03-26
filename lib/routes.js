Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
        this.render('phaseZeroTemplate');
    },
    {
        name: 'phase0'
    }
);

Router.route('/phasePreliminaire', function () {
        this.render('phasePreliminaireTemplate');
    },
    {
        name: 'phase1'
    }
);

Router.route('/phaseFinale', function () {
        this.render('phaseFinaleTemplate');
    },
    {
        name: 'phase2'
    }
);

