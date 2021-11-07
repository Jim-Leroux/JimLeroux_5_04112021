// Déclaration de productInCart dans laquelle on injecte le tableau du LS

let productInCart = JSON.parse(localStorage.getItem("product"));

// Gestion de l'alerte lorsque le panier n'est pas vide.
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

// JSON.parse converti les données format JSON du LS en JS

// Affichage des produits du panier

const SUMMARY = document.querySelector(".quanity-name-price");
let productDisplay = [];

// Si le panier est vide : afficher le panier est vide.
if (productInCart === null || productInCart == 0) {
  const EMPTY_CART = `
  <div class="d-flex align-items-center justify-content-center h-100">
  <p>Le panier est vide.</p>
  </div>
  `;
  SUMMARY.innerHTML = EMPTY_CART;
} else {
  // Si le panier est vide : afficher le panier est vide.
  for (i = 0; i < productInCart.length; i++) {
    productDisplay =
      productDisplay +
      `
                    <div class="col-12 text-center">
                        <div>Quantité 1 - ${productInCart[i].name} </div>
                        <div class="d-flex align-items-center justify-content-center"><div>${productInCart[i].price} € -</div>
                        <div class="delete-product text-danger d-flex align-items-center justify-content-center mx-1">Supprimer</div></div>
                    </div>
    `;
  }
  if (i === productInCart.length) {
    SUMMARY.innerHTML = productDisplay;
  }
}

// Gestion du bouton supprimer l'article.

let btn_delete = document.querySelectorAll(".delete-product");

for (let i = 0; i < btn_delete.length; i++) {
  btn_delete[i].addEventListener("click", (event) => {
    // Sélection de l'ID du produit qui va être supprimer.
    let id_delete_btn = productInCart[i].id;

    // Sélection des éléments à garder et suppression de l'élément cliqué.
    productInCart = productInCart.filter(
      (element) => element.id !== id_delete_btn
    );

    localStorage.setItem("product", JSON.stringify(productInCart));
    window.location = "panier.html";
  });
}

// Gestion du bouton vider le panier.
const DELETE_CART = document.querySelector(".delete-cart");

// Suppression de la KEY du Local Storage pour vider le panier.

DELETE_CART.addEventListener("click", () => {
  localStorage.removeItem("product");
  window.location = "panier.html";
});

// Gestion du calcul du prix total du panier.
let totalPriceCalc = [];

for (i = 0; i < productInCart.length; i++) {
  totalPriceCalc.push(productInCart[i].price);
}

const REDUCER = (accumulator, currentValue) => accumulator + currentValue;
const TOTAL_PRICE = totalPriceCalc.reduce(REDUCER, 0);

document.querySelector(".total-price").innerHTML = `
<div class="total-price">Montant total = ${TOTAL_PRICE} €</div>
`;

localStorage.setItem("price", JSON.stringify(TOTAL_PRICE));
// Réception des valeurs du formulaire à envoyer au Local Storage

const BTN_PUSH_FORM = document.querySelector("#confirm-order");
BTN_PUSH_FORM.addEventListener("click", () => {
  // Création d'un objet avec les valeurs

  const FORM_FIELDS = {
    firstName: document.querySelector("#firstname").value,
    lastName: document.querySelector("#lastname").value,
    address: document.querySelector("#adress").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  // Validation du formulaire

  const REGEX_NAME = (value) => {
    return /^[A-Za-z\-]{3,20}$/.test(value);
  };

  const REGEX_MAIL = (value) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  };

  const REGEX_ADRESS = (value) => {
    return /^[A-Za-z0-9\s\-]{5,100}$/.test(value);
  };

  const REGEX_CITY = (value) => {
    return /^[A-Za-z\s\-]{1,100}$/.test(value);
  };

  function firstNameControl() {
    const FIRST_NAME = document.querySelector("#firstname").value;
    if (REGEX_NAME(FIRST_NAME)) {
      document.querySelector("#firstNameInvalid").textContent = "";
      return true;
    } else {
      document.querySelector("#firstNameInvalid").textContent =
        "Veuillez bien remplir ce champ";
      return false;
    }
  }

  function lastNameControl() {
    const LAST_NAME = document.querySelector("#lastname").value;
    if (REGEX_NAME(LAST_NAME)) {
      document.querySelector("#lastNameInvalid").textContent = "";
      return true;
    } else {
      document.querySelector("#lastNameInvalid").textContent =
        "Veuillez bien remplir ce champ";
      return false;
    }
  }

  function adressControl() {
    const ADRESS = document.querySelector("#adress").value;
    if (REGEX_ADRESS(ADRESS)) {
      document.querySelector("#adressInvalid").textContent = "";
      return true;
    } else {
      document.querySelector("#adressInvalid").textContent =
        "Veuillez bien remplir ce champ";
      return false;
    }
  }

  function cityControl() {
    const CITY = document.querySelector("#city").value;
    if (REGEX_CITY(CITY)) {
      document.querySelector("#cityInvalid").textContent = "";
      return true;
    } else {
      document.querySelector("#cityInvalid").textContent =
        "Veuillez bien remplir ce champ";
      return false;
    }
  }

  function emailControl() {
    const EMAIL = document.querySelector("#email").value;
    if (REGEX_MAIL(EMAIL)) {
      document.querySelector("#emailInvalid").textContent = "";
      return true;
    } else {
      document.querySelector("#emailInvalid").textContent =
        "Veuillez bien remplir ce champ";
      return false;
    }
  }

  if (
    firstNameControl() &&
    lastNameControl() &&
    adressControl() &&
    cityControl() &&
    emailControl()
  ) {
    localStorage.setItem("form", JSON.stringify(FORM_FIELDS));
    // Création d'un objet avec les valeurs et les produits à envoyer au serveur

    const contact = FORM_FIELDS;
    const products = productInCart.map((product) => product.id);
    const TO_SEND = {
      contact,
      products,
    };

    console.log(products);
    const SEND = fetch("http://localhost:3000/api/cameras/order", {
      method: "POST",
      body: JSON.stringify(TO_SEND),
      headers: { "Content-Type": "application/json" },
    });
    console.log(SEND);
    SEND.then(async (response) => {
      const CONTENT = await response.json();
      console.log(CONTENT);
      localStorage.setItem("backend", JSON.stringify(CONTENT));
      localStorage.removeItem("form");
      localStorage.removeItem("product");
      window.location = "confirm.html";
    });
  }
});
