const socket = io();


let isInitialRender = true;

const cleanForm = (inputs) => {
  inputs.forEach((input) => {
    input.value = "";
  });
};

const getProducts = async () => {

  socket.emit("getProducts");

  return new Promise((resolve, reject) => {
    socket.on("gotProducts", (products) => {
      resolve(products);
    });

    socket.on("error", (error) => {
      reject(error);
    });
  });
};

const prepareList = () => {
  getProducts()
    .then((products) => {

      const elementosConClase = document.querySelectorAll(".product-flag");
      
      elementosConClase.forEach((elemento) => {
        elemento.remove();
      });
      renderList(products);
    })
    .catch((error) => {

      console.error("Error al obtener los productos:", error);
    });
};

const renderList = (products) => {
  let table = document.getElementById("product-table");

  for (let product of products) {
    let row = document.createElement("tr");
    row.classList.add("product-flag");
    row.id = `product-${product._id}`;

    row.innerHTML += `

    <td>${product._id}</td>

    <td>${product.title}</td>

    <td>${product.description}</td>

    <td>${product.price}</td>

    <td>${product.code}</td>

    <td>${product.stock}</td>

    <td>${product.status}</td>

    <td>${product.category}</td>

    <td><button id="${product._id}" type="button" class="button-delete">Delete</button></td>

    `;
    table.appendChild(row);
  }

  const buttons = document.querySelectorAll(".button-delete");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = e.target.id;
      const productRemove = document.getElementById(`product-${productId}`);
      if (productRemove) {
        productRemove.remove();
      }
      socket.emit("removeProduct", productId);
    });
  });
};

document.getElementById("product-form").addEventListener("submit", async (e) => {
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

  socket.once('gotProducts', (products) => {
    renderList(products);
  });

});

socket.emit('getProducts');
socket.once('gotProducts', (products) => {
  prepareList(products);
});

socket.on('productAdded', () => {
  getProducts().then((products) => {
    prepareList(products);
  });
});