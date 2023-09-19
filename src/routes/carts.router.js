const express = require("express");
const router = express.Router();
const {CartManager} = require("../services/cartService.js");

const carts = new CartManager();

router.get("/", async (req, res) => {
    res.send(await carts.readCart());
});

router.get("/:id", async (req, res) => {
    res.send(await carts.getCartById(req.params.id));
});

router.post("/", async (req, res) => {
    res.send(await carts.addCart());
});

router.patch ("/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    res.send(await carts.addProductCarts(cartId, productId));
});

module.exports = router;   