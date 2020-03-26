class Joueur{

    constructor(pseudo, ordreJoueur){
        this.pseudo = pseudo;
        this.mainDuJoueur = [];
        this.tourEnCours = false;
        this.maitreDuJeu = false;
        this.ordreJoueur = ordreJoueur;
    }
}

exports.Joueur = Joueur;