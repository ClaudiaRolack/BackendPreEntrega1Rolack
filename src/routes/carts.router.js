const express = require("express");
const router = express.Router();
const { CartManager } = require("../services/cartService");
const { cartsModel } = require("../models/carts.model");

const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        let cartData = await cartsModel.find();
        res.send({ result: "success", payload: cartData });
    } catch (error) {
        console.log(error);
    };
});

router.get("/population/:cid", async (req, res) => {
    let cartId = req.params.cid;
    res.send(await cartManager.getCartWithProducts(cartId));
});

router.post("/", async (req, res) => {
    let newProduct = req.body;
    res.send(await cartManager.addCart(newProduct))
});

router.put("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    let newProduct = req.body;
    res.send(await cartManager.updateProductsInCart(cartId, newProduct));
});

router.put("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let newProduct = req.body;
    res.send(await cartManager.updateProductInCart(cartId, prodId, newProduct));
});

router.delete("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    res.send(await cartManager.removeProductFromCart(cartId, prodId));
});


router.delete("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    res.send(await cartManager.removeAllProductsFromCart(cartId));
});

module.exports = router