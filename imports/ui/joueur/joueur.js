class Joueur{

    constructor(pseudo, ordreJoueur){
        this.pseudo = pseudo;
        this.mainDuJoueur = [];
        this.tourEnCours = false;
        this.maitreDuJeu = false;
        this.ordreJoueur  = ordreJoueur;
        this.tp = false;
        this.td = false;
        this.joker = false;
        this.nbGorgeesP = 0;
        this.nbGorgeesD = 0;
        this.gorgeesBues = 0;
        this.gorgeesDonnees = 0;
    }
}

exports.Joueur = Joueur;