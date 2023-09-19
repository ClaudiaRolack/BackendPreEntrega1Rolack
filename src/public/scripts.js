const socket = io();

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault()
  const productInput = document.getElementById("product") 
  const product = productInput.value 
  productInput.value = ""
  socket.emit("addProduct", { title: product })
})

document.getElementById("delete-button").addEventListener("button", (e) => {
  e.preventDefault()
  // const deleteProduct = 
})