const express = require("express");
const router = express.Router();
const {ProductManager} = require("../services/productService.js")

const product = new ProductManager()

router.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await product.getProducts())
    let allProducts = await product.getProducts();
    let productLimit = allProducts.slice(0, limit);
    res.send(productLimit);   
})

router.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    res.send(await product.getProductsById(id))
} )

router.put("/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    let updateProduct = req.body
    res.send(await product.updateProducts(id, updateProduct))
})

router.post("/", async (req, res) => {
    const newProduct = req.body
    res.send(await product.addProduct(newProduct))
   
})

router.delete("/:id", async (req, res) => {
    let id = parseInt(req.params.id) 
    res.send(await product.deleteProducts(id))
})



module.exports = router