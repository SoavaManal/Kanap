//les varriables
const container = document.getElementById("items");
let productsInfo = [];

//lire les données de l'API
const fetchProducts = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => (productsInfo = data));
};

//----Structurer la DOM----
const addProducts = async () => {
  await fetchProducts();
  productsInfo.forEach((product) => {
    //---balise a---
    const newCard = document.createElement("a");
    newCard.setAttribute("href", "./product.html?id=" + product._id);

    const newArticle = document.createElement("article");
    newCard.appendChild(newArticle);

    const newImage = document.createElement("img");
    const newHeader = document.createElement("h3");
    const newParagraphe = document.createElement("p");
    newArticle.appendChild(newImage);
    newArticle.appendChild(newHeader);
    newArticle.appendChild(newParagraphe);

    newImage.setAttribute("src", product.imageUrl);
    newImage.setAttribute("alt", product.altTxt);

    newHeader.classList.add("productName");
    newHeader.textContent = product.name;
    newParagraphe.classList.add("productDescription");
    newParagraphe.textContent = product.description;

    container.appendChild(newCard);
  });
};
addProducts();
