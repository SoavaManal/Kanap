const articles = document.getElementsByClassName("cart__item");
const forum = document.querySelector(".cart__order__form");
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

let myCart = JSON.parse(localStorage.getItem("produits"));
let idInCart = [];
let productInCart = [];

//fonction retourn un tableau avec les ids dans localStorage
const idCart = async () => {
  idInCart = myCart.map((product) => {
    product = product.id;
    return product;
  });
};

//chercher les informations des produits dont l'Id se trouve dans localStorage
const addToCart = async () => {
  await idCart();
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      productInCart = data.filter((product) => {
        for (element of idInCart) {
          if (product._id == element) return product;
        }
      });
    });
};

//afficher les produits stocké dans localStorage
const articleInCart = async () => {
  await addToCart();
  //structurer la DOM
  myCart.forEach((element) => {
    //balise article
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", element.id);
    article.setAttribute("data-color", element.color);

    //div img
    const divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    const image = document.createElement("img");
    productInCart.filter((product) => {
      if (product._id == element.id) {
        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.altTxt);
        divImg.appendChild(image);
      }
    });
    //div cart__item__content
    const divContent = document.createElement("div");
    divContent.classList.add("cart__item__content");
    //div cart__item__content__description
    const divDescription = document.createElement("div");
    divDescription.classList.add("cart__item__content__description");
    const h2 = document.createElement("h2");
    productInCart.filter((product) => {
      if (product._id == element.id) {
        h2.textContent = product.name;
      }
    });
    const color = document.createElement("p");
    color.textContent = element.color;
    const price = document.createElement("p");
    productInCart.filter((product) => {
      if (product._id == element.id) {
        price.textContent = product.price + ",00 €";
      }
    });
    divDescription.appendChild(h2);
    divDescription.appendChild(color);
    divDescription.appendChild(price);

    //div cart__item__content__settings
    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");
    const divQuantity = document.createElement("div");

    //div cart__item__content__settings__quantity
    divQuantity.classList.add("cart__item__content__settings__quantity");
    const pQte = document.createElement("p");
    pQte.textContent = "Qté : ";
    const quantity = document.createElement("input");
    quantity.classList.add("itemQuantity");
    quantity.setAttribute("type", "number");
    quantity.setAttribute("name", "itemQuantity");
    quantity.setAttribute("min", "1");
    quantity.setAttribute("max", "100");
    quantity.setAttribute("value", element.quantity);
    divQuantity.appendChild(pQte);
    divQuantity.appendChild(quantity);
    //div cart__item__content__settings__delete
    const divDelate = document.createElement("div");
    divDelate.classList.add("cart__item__content__settings__delete");
    const delate = document.createElement("p");
    delate.classList.add("deleteItem");
    delate.textContent = "Supprimer";
    divDelate.appendChild(delate);

    divSettings.appendChild(divQuantity);
    divSettings.appendChild(divDelate);

    divContent.appendChild(divDescription);
    divContent.appendChild(divSettings);

    article.appendChild(divImg);
    article.appendChild(divContent);
    document.getElementById("cart__items").appendChild(article);
  });
};

//caché le formulaire si le panier est vide
const cartIsEmpty = () => {
  if (!myCart) {
    //si le localstorage(produits) n'existe pas
    forum.style.visibility = "hidden";
  } else if (myCart.length == 0) {
    //si le localStorage est vide
    forum.style.visibility = "hidden";
  } else forum.style.visibility = "visible";
};
cartIsEmpty();

//fonction de Suppression du produit du panier
const deleteFunction = async () => {
  const btnDelete = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < btnDelete.length; i++) {
    let remove = btnDelete[i];
    remove.addEventListener("click", () => {
      myCart.splice(i, 1); //suprimer le produits du tableau localStorage
      articles[i].remove(); //supprimer l'article du DOM
      localStorage.setItem("produits", JSON.stringify(myCart)); //mise a jour du localeStorage
      location.reload(); //recharger la page pour mettre a jour nos totals
    });
  }
};

//modification du quantité
const quantityModify = async () => {
  const inputQuantity = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < inputQuantity.length; i++) {
    let modify = inputQuantity[i];
    //ecouer evenement change (quantité)
    modify.addEventListener("change", (e) => {
      myCart[i].quantity = e.target.value; //mise a jour de la valeur de quantité en localStorage
      if (myCart[i].quantity <= 0) {
        //suppression de produit si la valeur de la quantité est mise à 0
        myCart.splice(i, 1);
        articles[i].remove();
        localStorage.setItem("produits", JSON.stringify(myCart));
        location.reload(); //recharger la page pour mettre a jour nos totals
      }
      localStorage.setItem("produits", JSON.stringify(myCart));
      location.reload();
    });
  }
};

//calculer le total de la quantité
const totalQuantity = async () => {
  const totalQte = document.getElementById("totalQuantity");
  let total = 0;
  myCart.map((element) => {
    total += Number(element.quantity);
  });
  totalQte.textContent = total;
};

//calcule la totalité du prix
const totalPrice = async () => {
  const totalPrice = document.getElementById("totalPrice");
  let total = 0;
  let pricePerProduct = 0;
  myCart.filter((element) => {
    productInCart.filter((product) => {
      if (element.id == product._id) {
        pricePerProduct = Number(element.quantity) * Number(product.price);
      }
    });
    total += pricePerProduct;
  });
  totalPrice.textContent = total;
};

const pinUp = async () => {
  //regExp pour verifier url de la page
  if (myCart) {
    await articleInCart();
    await deleteFunction();
    await quantityModify();
    await totalQuantity();
    await totalPrice();
  }
  //cartIsEmpty();
};

pinUp();

//veriffier le formulaire

//fonction verifie le prenom le nom et le nom de la ville avec des expression reguliére
const isValid = (test) => {
  let name = new RegExp("^[A-Za-zéèê -]{3,}$"); //les nom & prenom minimum 3 lettres pas de chiffre
  return name.test(test);
};
forum.firstName.addEventListener("change", () => {
  let messageVerification = document.getElementById("firstNameErrorMsg");
  if (isValid(firstName.value)) {
    messageVerification.textContent = "";
  } else messageVerification.textContent = "Prenom non valide!!!";
});

//verifier le nom

forum.lastName.addEventListener("change", () => {
  let messageVerification = document.getElementById("lastNameErrorMsg");
  if (isValid(lastName.value)) {
    messageVerification.textContent = "";
  } else messageVerification.textContent = "Nom non valide!!!";
});

//verifier l'adresse
const addressIsValid = (test) => {
  let address = new RegExp("^[a-zA-Z0-9éèê,. '-]{3,}$"); //axxepte des chiffres et des lettres
  return address.test(test); //tester la valeur de input
};
forum.address.addEventListener("change", () => {
  let messageVerification = document.getElementById("addressErrorMsg");
  if (addressIsValid(address.value)) {
    messageVerification.textContent = "";
  } else messageVerification.textContent = "adresse non valide!!!";
});

//verifier le nom de la ville

forum.city.addEventListener("change", () => {
  let messageVerification = document.getElementById("cityErrorMsg");
  if (isValid(city.value)) {
    messageVerification.textContent = "";
  } else messageVerification.textContent = "la ville n'est pas valide!!!";
});

//verifier l'email
const emailIsValid = (test) => {
  let email = new RegExp(
    "^[A-Za-z0-9.-_]{1,}[@]{1}[A-Za-z0-9-_]{1,}[.]{1}[a-z]{2,4}$"
  ); //expressions reguliére pour verrifier les email
  return email.test(test); //tester la valeur de input
};
forum.email.addEventListener("change", () => {
  let messageVerification = document.getElementById("emailErrorMsg");
  if (emailIsValid(email.value)) {
    messageVerification.textContent = "";
  } else messageVerification.textContent = "votre email n'est pas valide!!!";
});
//la methode POST pour envoyer la commande au serveur

const btnOrder = document.getElementById("order");
//ecouter evenement au click
btnOrder.addEventListener("click", (e) => {
  e.preventDefault(); //arreter ou bloque l'action par defaut
  if (
    //verrifier si les champs du formulaire sont bien rempli et valide avvant de transmettre les données
    isValid(firstName.value) &&
    isValid(lastName.value) &&
    isValid(city.value) &&
    addressIsValid(address.value) &&
    emailIsValid(email.value)
  ) {
    let order = {
      //objet a posté "POST"
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value,
      },
      products: idInCart,
    };
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((data) => {
        document.location.href = "confirmation.html?id=" + data.orderId;
        localStorage.removeItem("produits"); //vider localeStorage
        //cartIsEmpty();
      })
      .catch((error) => console.log(error));
  } else {
    alert("Merci de bien renseigné le formulaire !!");
  }
});
