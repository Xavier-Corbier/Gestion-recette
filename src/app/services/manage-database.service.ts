import { Injectable } from '@angular/core';
import {IngredientService} from "./ingredient.service";
import {Ingredient} from "../models/ingredient";
import {AllergèneService} from "./allergène.service";
import {Allergène} from "../models/allergène";

/**
 * C'est un fichier qui permet de recréer tous les ingrédients et allergènes de la base de données.
 */
@Injectable({
  providedIn: 'root'
})
export class ManageDatabaseService {

  constructor(
    private ingredientService : IngredientService,
  private allergeneService : AllergèneService
  ) { }

  updateDatabase(){
    this.deleteAllIngredient();
    this.deleteAllAllergene();
  }

  deleteAllAllergene(){
    let sub = this.allergeneService.getAllAllergenes().subscribe(
      (tabAllergene)=> {
        if(tabAllergene){
          tabAllergene.forEach((allergene)=> {
            this.allergeneService.deleteAllergene(allergene.id!)
          })
          sub.unsubscribe();
          this.updateAllergene()
        }
      });
  }
  updateAllergene(){
    let listAllergene : Allergène[] = [];
    listAllergene.push(new Allergène("Arachide",[]))
    listAllergene.push(new Allergène("Cèleri",[]))
    listAllergene.push(new Allergène("Crustacés",["Crabe","Crevette","Écrevisse","Homard","Langoustine"]))
    listAllergene.push(new Allergène("Céréales contenant du Gluten",["Avoine","Blé","Épeautre","Kamut","Orge","Seigle"]))
    listAllergene.push(new Allergène("Fruits à coque",["Amande","Noisette","Noix","Noix du Brésil","Noix de cajou","Noix de macadamia", "Noix de pécan", "Noix du Queensland", "Pistache"]))
    listAllergene.push(new Allergène("Lait",[]))
    listAllergene.push(new Allergène("Lupin",[]))
    listAllergene.push(new Allergène("Oeuf",[]))
    listAllergene.push(new Allergène("Moutarde",[]))
    listAllergene.push(new Allergène("Sésame",[]))
    listAllergene.push(new Allergène("Soja",[]))
    listAllergene.push(new Allergène("Poisson",[]))
    listAllergene.push(new Allergène("Sulfites",[]))
    listAllergene.push(new Allergène("Molusques",["Boulot","Calamar","Escargot","Huitre,","Moule","Palourde", "Pétoncle", "Pieuvvre"]))
    for (let i = 0; i < listAllergene.length; i++) {
      this.allergeneService.addNewAllergene(listAllergene[i]);
    }
  }
  deleteAllIngredient(){
    let sub = this.ingredientService.getAllIngredients().subscribe(
      (tabIngredient)=> {
        if(tabIngredient){
          tabIngredient.forEach((ingredient)=> {
            this.ingredientService.deleteIngredient(ingredient.idIngredient!)
          })
          sub.unsubscribe();
          this.updateIngredient()

        }
      });
  }
  updateIngredient(){
    let ingredientList : Ingredient[] = [];
    ingredientList.push(new Ingredient("Epaule d'agneau sans os",0,8.49,"Kg","VIANDES / VOLAILLES",[]))
    ingredientList.push(new Ingredient("Filet de poulet",0,4.12,"Kg","VIANDES / VOLAILLES",[]))
    ingredientList.push(new Ingredient("Jarret ou Paleron de bœuf",0,2.92,"Kg","VIANDES / VOLAILLES",[]))
    ingredientList.push(new Ingredient("Poitrine fumée",0,5.10,"Kg","VIANDES / VOLAILLES",[]))
    ingredientList.push(new Ingredient("Joue de bœuf",0,13,"Kg","VIANDES / VOLAILLES",[]))
    ingredientList.push(new Ingredient("Avant bœuf pour viande haché",0,11.50,"Kg","VIANDES / VOLAILLES",[]))
    this.addIngredientList(ingredientList);
    ingredientList=[];
    ingredientList.push(new Ingredient("Crevettes surg 30/40",0,17.61,"Kg","POISSON ET CRUSTACES",[]))
    ingredientList.push(new Ingredient("Dos de cabillaud sans peau surg",0,13.90,"Kg","POISSON ET CRUSTACES",[]))
    ingredientList.push(new Ingredient("Ecrevisses surg",0,9.90,"Kg","POISSON ET CRUSTACES",[]))
    ingredientList.push(new Ingredient("Filet de saumon",0,13.50,"Kg","POISSON ET CRUSTACES",[]))
    ingredientList.push(new Ingredient("Parure de saumon fumé",0,5.57,"Kg","POISSON ET CRUSTACES",[]))
    this.addIngredientList(ingredientList);
    ingredientList=[];
    ingredientList.push(new Ingredient("Beurre",0,5.57,"Kg","CREMERIE",[]))
    ingredientList.push(new Ingredient("Crème liquide",0,2.50,"L","CREMERIE",[]))
    ingredientList.push(new Ingredient("Lait",0,0.62,"L","CREMERIE",[]))
    ingredientList.push(new Ingredient("Œufs",0,0.11,"P","CREMERIE",[]))
    ingredientList.push(new Ingredient("Parmesan",0,13.75,"Kg","CREMERIE",[]))
    ingredientList.push(new Ingredient("Reblochon",0,10,"Kg","CREMERIE",[]))
    ingredientList.push(new Ingredient("Mascarpone",0,7.22,"Kg","CREMERIE",[]))
    ingredientList.push(new Ingredient("Jaunes d'œuf au litre",0,9.75,"L","CREMERIE",[]))
    ingredientList.push(new Ingredient("Blancs d'œuf  au litre",0,8,"L","CREMERIE",[]))
    ingredientList.push(new Ingredient("Œufs entiers au litre",0,2.50,"L","CREMERIE",[]))
    ingredientList.push(new Ingredient("Crème mascarpone",0,5.37,"L","CREMERIE",[]))
    ingredientList.push(new Ingredient("Beurre demi sel",0,6,"Kg","CREMERIE",[]))
    ingredientList.push(new Ingredient("Mozarella",0,5,"Kg","CREMERIE",[]))
    this.addIngredientList(ingredientList);
    ingredientList=[];
    ingredientList.push(new Ingredient("Potimarron",0,2.20,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Oignons",0,2,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Oignons rouges",0,2.6,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Carrotes",0,1.75,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Courgettes",0,2,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Cèpes surg pied et morceaux",0,12.5,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Poires",0,7.5,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Pommes Granny Smith",0,2.6,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Céleri rave",0,2,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Citron jaune",0,3.6,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Citron vert",0,5.5,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Choux fleur",0,3.6,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Ail",0,4.5,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Poireaux",0,3,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Bouquet garni",0,0.05,"P","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Echalotes",0,2,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Persil",0,0,"Botte","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Pommes de terre",0,0.95,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Orange",0,1.95,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("pomme golden",0,1.89,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Basilic surg",0,22,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Cebette",0,0.95,"B","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Petits pois surg",0,2.21,"Kg","FRUITS ET LEGUMES",[]))
    ingredientList.push(new Ingredient("Menthe",0,0.9,"botte","FRUITS ET LEGUMES",[]))
    this.addIngredientList(ingredientList);
    ingredientList=[];
    ingredientList.push(new Ingredient("Pois chiche 4/4",0,3.75,"B","EPICERIE",[]))
    ingredientList.push(new Ingredient("Cœur de palmier 4/4",0,3.56,"B","EPICERIE",[]))
    ingredientList.push(new Ingredient("Vinaigre de riz",0,7.06,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Miel",0,9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sauce nuoc nam",0,20,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Cuisses de canard confites 5/1",0,29.88,"B","EPICERIE",[]))
    ingredientList.push(new Ingredient("Huile de sésame",0,11,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Huile d'olive",0,5.01,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Huile de tournesol",0,1.51,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Huile de pépins de raisin",0,3.6,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Graines de sésame",0,36,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Piment d'Espelette",0,200,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Agar agar",0,82.6,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Nouilles chinoise",0,16,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sésame noir en pâte",0,30,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fond blanc de veau",0,8.83,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Jus d'agneau déshydraté",0,8.83,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fond brun de veau lié",0,8.83,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fumet de poisson",0,9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sauce soja au yuzu (ponzu)",0,45,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sarasin en grain",0,5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Cognac",0,8,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Vin blanc",0,2,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Concentré de tomate",0,12.84,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Safran",0,2000,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pois cassés",0,2.18,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Epices à tajine",0,20,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Abricots secs",0,8,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Semoule de blé moyenne",0,1.3,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Crozet de Savoie",0,6,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Noix muscade",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Riz rond arborio",0,1.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Cèpes séchès",0,40,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Malibu",0,12,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Coco râpé",0,18,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Levure de boulanger",0,11,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Muscat de Lunel",0,8.65,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Farine",0,0.7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Calvados",0,30,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fécule",0,6.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("vinaigre blanc",0,0.8,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Huile d'arachide",0,1.31,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pesto",0,7,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Chapelure brune",0,1.70,"Kg","EPICERIE",[]))

    ingredientList.push(new Ingredient("Sel fin",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Gros sel",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poivre blanc",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poivre noir",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("fleur de sel de camargue",0,38,"Kg","EPICERIE",[]))

    ingredientList.push(new Ingredient("Sucre semoule",0,0.54,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Chocolat blanc",0,5.35,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Chocolat lait suprème belcolade",0,5.35,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fleur de cao",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Glucose",0,3.89,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Cacao poudre",0,7.42,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Gélatine (feuille de 2g)",0,29.7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Vanille gousses",0,2.20,"P","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poudre d'amande",0,7.11,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Spigol",0,269.4,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Baking Power",0,4.99,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Jus d'orange",0,1.7,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sirop basilic",0,0,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sucre glace",0,1.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Beurre de cacao",0,21,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Nappage neutre",0,10,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Colorant jaune en poudre",0,124,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Chocolat noir ariaga",0,5.25,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Stabilisateur",0,50,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sachet de vanille",0,1.5,"U","EPICERIE",[]))

    ingredientList.push(new Ingredient("Cacao poudre",0,9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Praliné amande noisette",0,19.9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Feuillantine",0,12,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Genduja",0,29.7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Café soluble",0,35,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Amaretto",0,30,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Boudoir carton de 240P",0,13.35,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Café grains",0,12,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pate de marron imbert",0,11,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Noisettes",0,12,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pure pâte de pistache",0,40,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pâte de pistche aromatisée colorée",0,39,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sucre casonade",0,1.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poudre de Noisette grise",0,12,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pistache entière",0,13,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Arome Hibiscus",0,34,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poudre à crème",0,6.69,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Colorant rouge",0,124,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fève tonga",0,150,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Rhum",0,25,"L","EPICERIE",[]))

    ingredientList.push(new Ingredient("Exxtrait de vanille",0,23,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Amandes amère",0,32,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Farine de riz",0,3,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pate de noisette",0,22,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poudre de pistache",0,50,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("jus de pommes",0,1.8,"l","EPICERIE",[]))
    ingredientList.push(new Ingredient("Feuilletage",0,7.33,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Trimoline",0,11.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fond de tarte",0,0.45,"P","EPICERIE",[]))
    ingredientList.push(new Ingredient("Amandes mondées",0,18,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Kahlua",0,16.18,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pectine NH",0,37.8,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Farine traité thermiquement",0,1,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Anis étoilé",0,37.8,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Cannelle moulue",0,13.51,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pruneaux",0,7.9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Amandes batonnets",0,13.07,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Noix de pécan",0,24.99,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Figues séchées",0,15.8,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Vergeoise",0,3.08,"Kg","EPICERIE",[]))

    ingredientList.push(new Ingredient("Spéculos",0,7.96,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fructose",0,3.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Brownies",0,14,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Amandes hachées",0,8.9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Noisettes hachées",0,14.9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Paprika",0,11,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sorbitol",0,12.51,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Fleur d’oranger",0,10.95,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Grisettes de Montpellier",0,17,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Poudre de réglisse",0,28,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Orange confite",0,17.99,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Grand Marnier",0,22.9,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Huile de citron",0,90,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Citron confit",0,8.5,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Blanc d’oeuf en poudre",0,20.47,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Colorant vert en poudre",0,150,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Weck entrée /dessert",0,0.69,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Weck plat",0,0.74,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("compote de pomme",0,2.15,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sorbet fraise",0,0,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Glace otantic 2,5L",0,10.90,"U","EPICERIE",[]))

    ingredientList.push(new Ingredient("Purée mangue",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée de citron jaune",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée coco",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée fruits rouges",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("jus de pomme",0,1.05,"L","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée de framboise",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée passion",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée Myrtille",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée de banane",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée de leetchi",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Purée de citron vert",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("purée de cranberry",0,7,"Kg","EPICERIE",[]))
    ingredientList.push(new Ingredient("Boite blanche",0,0.59,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Plateau carton",0,0.36,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Pique bambou",0,0.01,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Carton",0,0.5,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Barquette thermoscellées",0,0.07,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Barquettes alu 2250ml",0,0.28,"U","EPICERIE",[]))
    ingredientList.push(new Ingredient("Sac pour arrancini",0,0.3,"U","EPICERIE",[]))

    this.addIngredientList(ingredientList);
  }

  private addIngredientList(ingredientList: Ingredient[]) {
    this.ingredientService.addNewIngredient(ingredientList[0], true);
    for (let i = 1; i < ingredientList.length; i++) {
      this.ingredientService.addNewIngredient(ingredientList[i], false);
    }
  }
}
