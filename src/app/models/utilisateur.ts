export class Utilisateur {

  public uid : string;
  public nom : string;
  public prenom : string;
  public email : string;
  public estAdmin : boolean;
  public motdepasse : string;


  constructor(uid : string,
              nom : string,
              prenom : string,
              email : string,
              estAdmin : boolean) {
    this.uid = uid;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.estAdmin = estAdmin;
    this.motdepasse = "";
  }

  setMdp(motdepasse : string){
    this.motdepasse = motdepasse;
  }

  getDroitAdmin() : boolean{
    return  this.estAdmin;
  }


}
