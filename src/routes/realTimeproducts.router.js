const express = require("express");
const router = express.Router();
const {ProductManager} = require("../services/productService");

const product = new ProductManager();

router.get("/", async (req, res) => {
    let allProducts = await product.getProducts();
    
    res.render("realTimeproducts.hbs",{
        products : allProducts
    });
});


module.exports = router;