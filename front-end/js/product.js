let productInCart = JSON.parse(localStorage.getItem("product"));

let params = new URL(document.location).searchParams;
let id = params.get("id");

let productData = [];

const ICON_ALERT = document.querySelector(
  "#navbarSupportedContent > ul > li:nth-child(3) > a"
);

const CART_ALERT = (product_inCart) => {
  if (product_inCart && product_inCart.length > 0) {
    ICON_ALERT.innerHTML = `
    <i class="bi bi-bag-check-fill nav-icon-size text-warning"></i>
    `;
  } else {
    ICON_ALERT.innerHTML = `
    <i class="bi bi-bag nav-icon-size"></i>
    `;
  }
};

CART_ALERT(productInCart);

// Récéption des données du produit choisi par l'utilisateur avec le paramètre de la requête.
const FETCH_USER = async () => {
  await fetch(`http://localhost:3000/api/cameras/${id}`)
    .then((result) => result.json())
    .then((data) => (productData = data))

    // Si erreur, un message s'affiche à l'écran pour l'utilisateur et dans la console.
    .catch((error) => {
      document.body.innerHTML = `
    "<main class="d-flex align-items-center justify-content-center">
      <div class="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
        <h1 class="text-dark text-center">Impossible d'accéder aux produits, veuillez vous assurer d'être sur le port 3000 & que le serveur soit lancer.
        </h1>
      </div>
    </main>"
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
  document.getElementById("product-page").innerHTML = `
        <div class="row">
              <div class="col d-flex align-items-center justify-content-center">
                  <img class="w-75 img" src="${
                    productData.imageUrl
                  }" alt="photo du produit">
                </div>
              <div class="col-lg">
                <div class="product-description">
                  <h2>${productData.name}</h2>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis repudiandae neque, voluptas exercitationem</p>
                    <h3 id="product-price">${
                      PRICE_CALC(productData.price) + " €"
                    }</h3>
                    <div class="">
                    <select id="option-select" class="form-select w-75" aria-label="Default select example">
                    <option selected>Appareil seul</option>
                  </select>
                  <input type="number" class="form-control numberForm" value="1" min="1" max="10">
                  </div>
                  <div class="py-3">
                  <button class="btn btn-warning addToCart-btn onclick="this.blur()">Ajouter au panier</button>
                  <a class="btn btn-warning btn-panier" href="panier.html">Voir le panier</a>
                </div>
                <a class="continueShop" href="../../index.html#product">Continuer mes achats</a>
                </div>
              </div>
          </div>
    `;

  // Nombre d'options équivalent aux données de l'API avec la boucle FOR.
  let LenseSelect = document.getElementById("option-select");
  for (let i = 0; i < productData.lenses.length; i++) {
    let option = document.createElement("option");
    option.innerText = productData.lenses[i];
    LenseSelect.appendChild(option);
  }
};

PRODUCT_DISPLAY();

const ADD_TO_CART = async () => {
  await FETCH_USER();

  const HOW_MANY = document.querySelector(".numberForm");
  const ADDED = document.querySelector(".addToCart-btn");

  ADDED.addEventListener("click", () => {
    if (HOW_MANY.value > 0 && HOW_MANY.value < 100) {
      ADDED.className = "btn btn-success addToCart-btn";
      ADDED.innerHTML = "Ajouté";

      setTimeout(() => {
        ADDED.className = "btn btn-warning addToCart-btn";
        ADDED.innerHTML = "Ajouter au panier";
      }, 1000);

      let productQuantity = document.querySelector(".numberForm").value;

      // Création du produit qui va être ajouter au panier.

      let addedProduct = {
        name: productData.name,
        price: (productData.price / 100) * productQuantity,
        quantity: productQuantity,
        id: id,
      };
      // Stockage du/des produits dans le local storage.

      // Déclaration de productInCart qui contiendra les key/values contenu dans le local storage.
      let productInCart = JSON.parse(localStorage.getItem("product"));

      // Ajouter un produit au local storage.
      const ADD_TO_LOCALSTORAGE = () => {
        productInCart.push(addedProduct);
        localStorage.setItem("product", JSON.stringify(productInCart));
      };

      // Si le LS contient un produit, on envoie son contenu dans un tableau et on le renvoie dans LS avec le nouveau produit
      if (productInCart) {
        ADD_TO_LOCALSTORAGE();
      } else {
        // Si le LS ne contient rien, on crée un tableau, on ajoute le produit dans le tableau ensuite on envoie le tableau dans le LS
        productInCart = [];
        ADD_TO_LOCALSTORAGE();
      }
      CART_ALERT(productInCart);
      console.log(productInCart);
    }
  });
};

ADD_TO_CART();
