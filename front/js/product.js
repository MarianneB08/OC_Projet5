/////////////// AFFICHAGE DU PRODUIT SUR LA PAGE PRODUIT ///////////////

// Variables globales

const urlGlobale = "http://localhost:3000/api/products/";
const url = window.location.href;
const urlKanap = new URL(url);
let idKanap = "";
const couleurInput = document.querySelector("#colors");
const quantiteInput = document.querySelector("#quantity");
const btnAjouterAuPanier = document.querySelector("#addToCart");
const quantiteParDefaut = 0;
const seuilInferieur = 0;
const seuilSuperieur = 100;
const alerteCouleurEtQuantite = "Veuillez indiquer la couleur et la quantité souhaitées";
const alerteNombreProduitsMax = "Vous ne pouvez pas commander plus de 100 produits";
let infosKanap;

// On récupère l'id du produit dans l'url de la page produit

let search_params = new URLSearchParams(urlKanap.search);

if (search_params.has('id')) {
    idKanap = search_params.get('id');
};

// On appelle l'API pour récupérer les caractéristiques du produit

fetch(`${urlGlobale}${idKanap}`)
    .then(function (reponse) {
        return reponse.json();
    })
    .then(function (listeKanap) {
        afficherProduit(listeKanap);
    })


/////////////// MISE EN PLACE DE MESSAGES D'ALERTES ///////////////

btnAjouterAuPanier.addEventListener("click", () => {
    console.log(couleurInput.value);
    if (couleurInput.value === null || couleurInput.value == "" || quantiteInput.value == null || quantiteInput.value === "" || quantiteInput.value <= seuilInferieur) {
        alert(alerteCouleurEtQuantite)
    } else if (quantiteInput.value > seuilSuperieur) {
        alert(alerteNombreProduitsMax)
        quantiteInput.value = quantiteParDefaut;
    } else {
        ajouterAuPanier();
    }
});

function afficherProduit(listeKanap) {
    // On injecte les caractéristiques dans la structure HTML
    let title = document.getElementById("title");
    title.textContent = (infosKanap, listeKanap.name);

    let price = document.getElementById("price");
    price.textContent = (infosKanap, listeKanap.price);

    let description = document.getElementById("description");
    description.textContent = (infosKanap, listeKanap.description);

    let imageContainer = document.querySelector(".item__img");
    let imgKanap = document.createElement("img");
    imgKanap.src = (infosKanap, listeKanap.imageUrl);
    imgKanap.alt = (infosKanap, listeKanap.altTxt);
    imageContainer.appendChild(imgKanap);

    const tableauCouleurs = listeKanap.colors;
    let select = document.getElementById("colors");
    for (let couleur of tableauCouleurs) {
        let option = document.createElement("option");
        option.value = couleur;
        option.textContent = couleur;
        select.appendChild(option);
    }
}


/////////////// AJOUT DU PRODUIT ET DE SES CARACTÉRISTIQUES AU LOCALSTORAGE ///////////////


function ajouterAuPanier() {
    choixClient = { // Objet contenant les 3 informations qui doivent figurer dans le localStorage
        kanapChoisi: idKanap,
        couleurChoisie: couleurInput.value,
        quantiteChoisie: parseInt(quantiteInput.value)
    }
    let contenuLocalStorage = JSON.parse(localStorage.getItem("choixClient"))
    if (contenuLocalStorage === null) { // Cas de figure si le localStorage est vide
        contenuLocalStorage = [];
        contenuLocalStorage.push(choixClient)
        localStorage.setItem("choixClient", JSON.stringify(contenuLocalStorage))
        alert("Votre sélection a bien été ajoutée au panier")
    } else { // Cas de figure si le localStorage contient au moins un élément
        for (let v of contenuLocalStorage) {
            // Cas de figure si le localStorage contient un élément avec le même ID et la même couleur
            if (v.kanapChoisi === choixClient.kanapChoisi && v.couleurChoisie === choixClient.couleurChoisie) {
                v.quantiteChoisie = v.quantiteChoisie += choixClient.quantiteChoisie
                localStorage.setItem("choixClient", JSON.stringify(contenuLocalStorage))
                alert("Votre sélection a bien été ajoutée au panier")
                break
            }   // Cas de figure si le localStorage contient un élément avec le même ID mais pas la même couleur
            else if (v.kanapChoisi === choixClient.kanapChoisi && v.couleurChoisie !== choixClient.couleurChoisie) {
                contenuLocalStorage.push(choixClient)
                localStorage.setItem("choixClient", JSON.stringify(contenuLocalStorage))
                alert("Votre sélection a bien été ajoutée au panier")
                break
            } else { // Cas de figure si le localStorage contient un élément avec un ID différent
                if (v.kanapChoisi != choixClient.kanapChoisi) {
                    contenuLocalStorage.push(choixClient)
                    localStorage.setItem("choixClient", JSON.stringify(contenuLocalStorage))
                    alert("Votre sélection a bien été ajoutée au panier")
                }
                break
            }
        }
    }
}