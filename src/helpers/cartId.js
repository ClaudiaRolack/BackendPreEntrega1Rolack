const fs = require("fs").promises;

async function cartId() {
    try {

      const data = await fs.readFile("./cart.json", "utf-8");
      const carts = JSON.parse(data);
  
      const lastCart= carts[carts.length - 1];
      const lastId = lastCart ? lastCart.id : 0;
  

      const newId = lastId + 1;
  
      await fs.writeFile("cart.json", JSON.stringify(carts, null, 2), "utf-8");
  
      return newId;

    } catch (error) {
      console.error("Error al obtener el siguiente ID o escribir en el archivo JSON", error);
      throw error;
    }
  }

  module.exports = cartId;