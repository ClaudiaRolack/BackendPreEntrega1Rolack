const express = require("express");
const router = express.Router();
const {ProductManager} = require("../services/productService");

const product = new ProductManager();

router.get("/list", async (req, res) => {
    let allProducts = await product.getProducts();
    
    res.render("home.hbs",{
        products : allProducts
    });
});

module.exports = router;