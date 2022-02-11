//les varriables
const parametreUrl = new URLSearchParams(document.location.search); // renvoi les paramettres de URL
const nameParams = parametreUrl.get("id"); // renvoi la valeur du parametre
const imagProd = document.createElement("img"); //creer un element <img>
const colorOption = document.getElementById("colors");
const btnAddToCart = document.getElementById("addToCart");

let productsInfo = [];
let titleProduct = "";
let priceProduct = "";
let descriptionProd = "";
let colorProd = [];
let quantityValue = 0;
let colorSelected = "";

//Methode Get(read) chercher les données du produit choisi
const fetchProducts = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then(
      (
        data //utilise id en paramettre pour retourner les infos du produits
      ) =>
        (productsInfo = data.filter((product) => {
          return product._id == nameParams;
        }))
    );
};
//----Structurer la DOM----
//renvoi image du produit
const imgProduct = async () => {
  productsInfo.forEach((product) => {
    imagProd.setAttribute("src", product.imageUrl);
    imagProd.setAttribute("alt", product.altTxt);
    document.querySelector(".item__img").appendChild(imagProd);
  });
};

//revoi le nom et le prix du produit
const contentProducts = async () => {
  titleProduct += productsInfo.map((product) => (product = product.name));
  document.getElementById("title").textContent = titleProduct;

  priceProduct += productsInfo.map((product) => (product = product.price));
  document.getElementById("price").textContent = priceProduct;
};

//renvoi la description du produit
const descriptionProduct = async () => {
  descriptionProd += productsInfo.map(
    (product) => (product = product.description)
  );
  document.getElementById("description").textContent = descriptionProd;
};

//creer les options(couleurs) du prduits
const colorProduct = async () => {
  colorProd = productsInfo.map((product) => (product = product.colors));
  colorProd.forEach((colors) => {
    colors.forEach((color) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", color);
      newOption.textContent = color;
      colorOption.appendChild(newOption);
    });
  });
};

//appeler les fonctions d'affichage
const productSelected = async () => {
  await fetchProducts();
  await imgProduct();
  await contentProducts();
  await descriptionProduct();
  await colorProduct();
};
productSelected();

//lire la valeur indiqué dans l'input de quantité et la remettre a 0 si la valeur et négative
const quantity = document.getElementById("quantity");
quantity.addEventListener("change", (e) => {
  quantityValue = e.target.value;
  let quantityVerification = new RegExp("^[0-9]{1,2}$"); //Exp reguliere
  if (!quantityVerification.test(quantityValue)) {
    quantity.value = 0; //remettre la valeur afficher a 0
    quantityValue = 0; //remettre la valeur a 0
  }
});

//lire l'option du couleur selectionné
document
  .getElementById("colors")
  .setAttribute("onchange", "getSelectedValue()");
const getSelectedValue = () => {
  colorSelected = document.getElementById("colors").value;
};

//Confirmer l'ajout du produit au panier
const toConfirm = () => {
  if (
    //OK=>page cart voir le panier
    confirm(
      "commande a bien été ajouter au panier! Consultez le panier OK ou revenir a l'aceuil ANNULER "
    )
  ) {
    document.location.href = "cart.html";
  } else {
    //ANNULER=>page d'acceuil pour continuer les achats
    document.location.href = "index.html";
  }
};

//ajouter un evenement au click
btnAddToCart.addEventListener("click", () => {
  //si la couleur ou la quantiter du produit ne sont pas renseignés
  if (colorSelected === "" || quantityValue == 0) {
    alert("Merci de renseigner la couleur et la quantité souhaitée");
  } else {
    let product = {
      //creer un produit avec id quantite et coleur
      id: nameParams,
      quantity: quantityValue,
      color: colorSelected,
    };
    let arrayProduct = JSON.parse(localStorage.getItem("produits"));
    //s'il ya deja des produits dans le localStorage je push(ajoute) d'autre objet a mon tableau
    if (arrayProduct) {
      //si le id et la couleur existe déja dans notre tableau en incremente la quantité sinon en ajoute le produit
      const getProduct = arrayProduct.find(
        (element) => element.id == product.id && element.color == product.color
      );
      if (getProduct) {
        getProduct.quantity =
          Number(getProduct.quantity) + Number(product.quantity);
        localStorage.setItem("produits", JSON.stringify(arrayProduct));
        toConfirm();
        quantity.value = 0;
        return;
      }
      arrayProduct.push(product);
      localStorage.setItem("produits", JSON.stringify(arrayProduct));
      console.log(arrayProduct);
      toConfirm();
      quantity.value = 0;
    }
    //sinon je cree un tableau et j'ajoute mon objet
    else {
      arrayProduct = [];
      arrayProduct.push(product);
      localStorage.setItem("produits", JSON.stringify(arrayProduct));
      console.log(arrayProduct);
      toConfirm();
      quantity.value = 0;
    }
  }
});
