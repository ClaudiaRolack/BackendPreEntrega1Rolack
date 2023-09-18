const express = require("express");
const router = express.Router();
const {ProductManager} = require("../services/productService")

const product = new ProductManager()

router.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    console.log(allProducts)
    res.render("home",{
        products : allProducts
    })
})

module.exports = router;