const socket = io();

const cleanForm = (inputs) => {
  inputs.forEach((input) => {
    input.value = "";
  });
};

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("title-input");
  const descriptionInput = document.getElementById("description-input");
  const priceInput = document.getElementById("price-input");
  const codeInput = document.getElementById("code-input");
  const stockInput = document.getElementById("stock-input");
  const statusInput = document.getElementById("status-input");
  const categoryInput = document.getElementById("category-input");

  const title = titleInput.value;
  const description = descriptionInput.value;
  const price = priceInput.value;
  const code = codeInput.value;
  const stock = stockInput.value;
  const status = statusInput.value;
  const category = categoryInput.value;

  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
    status,
    category,
  };
  const inputs = [
    titleInput,
    descriptionInput,
    priceInput,
    codeInput,
    stockInput,
    statusInput,
    categoryInput,
  ];
  cleanForm(inputs);

  socket.emit('addProduct', newProduct);
});