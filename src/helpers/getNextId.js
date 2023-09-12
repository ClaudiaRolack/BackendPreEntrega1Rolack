const fs = require("fs").promises;

async function getNextId() {
    try {

      const data = await fs.readFile("./src/products.json", "utf-8");
      const products = JSON.parse(data);
  
      const lastProduct = products[products.length - 1];
      const lastId = lastProduct ? lastProduct._id : 0;
  

      const newId = lastId + 1;
  
      await fs.writeFile("products.json", JSON.stringify(products, null, 2), "utf-8");
  
      return newId;
    } catch (error) {
      console.error("Error al obtener el siguiente ID o escribir en el archivo JSON", error);
      throw error;
    }
  }

  module.exports = getNextId