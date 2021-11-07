let productData = [];
// Récéption des données des produits de l'API.

const FETCH_USER = async () => {
  await fetch("http://localhost:3000/api/cameras")
    .then((result) => result.json())
    .then((data) => (productData = data))

    // Si erreur, un message s'affiche à l'écran pour l'utilisateur et dans la console.

    .catch((error) => {
      document.body.innerHTML = `
    <main class="d-flex align-items-center justify-content-center">
      <div class="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
        <h1 class="text-dark text-center">Impossible d'accéder aux produits, veuillez vous assurer d'être sur le port 3000 & que le serveur soit lancer.
        </h1>
      </div>
    </main>
    `;
      console.log(error);
    });
};

const PRODUCT_DISPLAY = async () => {
  await FETCH_USER();

  // Conversion du prix en euros.

  const PRICE_CALC = (price) => {
    let newPrice = price / 100;

    return newPrice;
  };

  // Création des éléments du DOM avec leurs données respectives.

  document.getElementById("section-block").innerHTML = productData
    .map(
      (product) => `
      <div class="row border border-top">
      <div class="col-md d-flex justify-content-center align-items-center">
      <img id="product-pic" class="w-75 py-3 img-size" src="${
        product.imageUrl
      }" alt="photo du produit">
    </div>
        <div class="col d-flex justify-content-center align-items-center p-3">
          <div>
            <h2 id="product-title">${product.name}</h2>
            <p id="product-description">${product.description}</p>
            <h3 id="product-price">${PRICE_CALC(product.price) + " €"}</h3>
            <a class="btn btn-warning" href="./front-end/html/product.html?id=${
              product._id
            }">Acheter</a>
          </div>
        </div>
      </div>
  `
    )
    .join("");
};

PRODUCT_DISPLAY();

let productInCart = JSON.parse(localStorage.getItem("product"));

const ICON_ALERT = document.querySelector(
  "#navbarSupportedContent > ul > li:nth-child(3) > a"
);

const CART_ALERT = () => {
  console.log(productInCart);
  if (productInCart && productInCart.length > 0) {
    ICON_ALERT.innerHTML = `
    <i class="bi bi-bag-check-fill nav-icon-size text-warning"></i>
    `;
  } else {
    ICON_ALERT.innerHTML = `
    <i class="bi bi-bag nav-icon-size"></i>
    `;
  }
};

CART_ALERT();

console.log(productInCart && productInCart.length > 0);
