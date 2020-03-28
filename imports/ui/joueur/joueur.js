class Joueur{

    constructor(pseudo, ordreJoueur){
        this.pseudo = pseudo;
        this.mainDuJoueur = [];
        this.tourEnCours = false;
        this.maitreDuJeu = false;
        this.ordreJoueur = ordreJoueur;
        this.tp = false;
        this.td = false;
        this.joker = false;
    }
}

exports.Joueur = Joueur;