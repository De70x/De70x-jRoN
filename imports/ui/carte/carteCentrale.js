class CarteCentrale{

    constructor(carte, numeroTirage){
        this.carte = carte;
        this.numeroTirage = numeroTirage;
        this.retournable = false;
        this.retournee = false;
        this.enCours = false;
    }
}

exports.CarteCentrale = CarteCentrale;