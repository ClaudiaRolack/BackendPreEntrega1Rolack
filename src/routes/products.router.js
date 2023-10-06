const { Router } = require("express");
const { productsModel } = require("../models/products.model");
const router = Router();

router.get("/", async (req, res) => {
    try {
        let products = await productsModel.find();
        res.send({ result: "success", payload: products });
    } catch (error) {
        console.log(error);
    };
});

router.post("/", async (req, res) => {
    let { title, description, price, code, stock } = req.body;

    if (!title || !description || !price || !code || !stock) {
        res.send({ status: "error", error: "Faltan datos" });
    } else {
        let result = await productsModel.create({ title, description, price, code, stock });
        res.send({ result: "success", payload: result });
    }
});

router.put("/:pid", async (req, res) => {
    let { pid } = req.params;
    let productsToReplace = req.body;

    if (!productsToReplace.title || !productsToReplace.description || !productsToReplace.price || !productsToReplace.code || !productsToReplace.stock) {
        res.send({ status: "error", error: "No hay datos en parametros" });
    } else {
        let result = await productsModel.updateOne({ _id: pid }, productsToReplace);
        res.send({ result: "success", payload: result });
    };
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productsModel.deleteOne({ _id: pid });
    res.send({ result: "success", payload: result });
});

module.exports = router