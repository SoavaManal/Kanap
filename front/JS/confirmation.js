//afficher le idOrder dans la page de confirmation
const paramsUrl = new URLSearchParams(document.location.search);
const productCart = JSON.parse(localStorage.getItem("produits"));
// renvoi les paramettres idOrder de URL
const parametre = paramsUrl.get("id");
const idOrders = document.getElementById("orderId");
idOrders.textContent = parametre;
