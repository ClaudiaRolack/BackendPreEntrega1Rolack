const express = require("express");
const router = express.Router();
const {cartsModel} = require("../models/carts.model");

router.get("/", async (req, res) => {
    try {
        let carts = await cartsModel.find();
        res.send({ result: "success", payload: carts });
    } catch (error) {
        console.log(error);
    };
});

router.post("/", async (req, res) => {
    let { title, price, quantity, total } = req.body;

    if (!title || !price || !quantity || !total) {
        res.send({ status: "error", error: "Faltan datos" });
    } else {
        let result = await cartsModel.create({ title, price, quantity, total });
        res.send({ result: "success", payload: result });
    }
});

router.put("/:cid", async (req, res) => {
    let { cid } = req.params;
    let cartsToReplace = req.body;

    if (!cartsToReplace.title || !cartsToReplace.price || !cartsToReplace.quantity || !cartsToReplace.total) {
        res.send({ status: "error", error: "No hay datos en parametros" });
    } else {
        let result = await cartsModel.updateOne({ _id: cid }, cartsToReplace);
        res.send({ result: "success", payload: result });
    };
});

router.delete("/:cid", async (req, res) => {
    let { cid } = req.params;
    let result = await cartsModel.deleteOne({ _id: cid });
    res.send({ result: "success", payload: result });
});

module.exports = router