import {Template} from "meteor/templating";

Template.menu.helpers({
    mesPseudos: () => {
        let vRet = "";
        const personnesConnectees = ConnexionsLocales.find({}).fetch();
        if(ConnexionsLocales.find({}) === 1){
            vRet += personnesConnectees[0].pseudo;
        }
        else {
            personnesConnectees.forEach(personneConnectee => {
                vRet += personneConnectee.pseudo + ", ";
            });
            vRet = vRet.substring(0,vRet.length -2);
        }
        return vRet;
    },
});