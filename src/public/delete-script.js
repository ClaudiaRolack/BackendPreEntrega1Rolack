const socket = io();

const buttons = document.querySelectorAll(".button-delete");

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const productId = e.target.id;
    const productRemove = document.getElementById(`product-${productId}`);
    if (productRemove) {
      productRemove.remove();
    }
    socket.emit('removeProduct', productId);
  });
});
