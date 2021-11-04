let confirmOrder = JSON.parse(localStorage.getItem("backend"));
let totalPrice = JSON.parse(localStorage.getItem("price"));

console.log(confirmOrder.orderId);
document.querySelector(
  "body > main > div > div > div > div > p:nth-child(2)"
).innerHTML = `
Votre commmande numéro ${confirmOrder.orderId}<br>d'un montant de <span class="confirmPrice">${totalPrice} €</span> a été validé.
`;
