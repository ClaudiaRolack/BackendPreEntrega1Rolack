const { Router } = require("express");
const mongoose = require("mongoose");
const { productsModel } = require("../models/products.model");
const { ProductManager } = require("../services/productService");

const productManager = new ProductManager();

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

router.get("/limit/:limit", async (req, res) => {
    let limit = parseInt(req.params.limit);
    if (isNaN(limit) || limit <= 0) { limit = 10; }
    try {
        const products = await productsModel.find().limit(limit);
        res.send({ result: "success", payload: products });
    } catch (error) {
        throw error;
    }
});

router.get("/page/:page", async (req, res) => {
    let page = parseInt(req.params.page);
    if (isNaN(page) || page <= 0) { page = 1; }
    const productsPerPage = 5;
    const products = await productManager.getProductsByPage(page, productsPerPage);
    res.send({ result: "success", payload: products });
});

router.get("/buscar/query", async (req, res) => {
    const query = req.query.q;
    try {
        const products = await productManager.getProductsByQuery(query);
        if (products.length === 0) {
            res.send({ result: "success", message: "No se encontraron productos" });
        } else {
            res.send({ result: "success", payload: products });
        }
    } catch (error) {
        throw error;
    };
});

router.get("/ordenar/sort", async (req, res) => {
    let sortOrder = 0;
    if (req.query.sort) {
        if (req.query.sort === "desc") {
            sortOrder = -1;
        }
    }
    res.send(await productManager.getProducstBySort(sortOrder))
});

router.get("/ordenar/sort", async (req, res) => {
    let sortOrder = 0 
    if (req.query.sort) {
        if (req.query.sort === "desc") {
            sortOrder = -1;
        }
    }
    try {
        const products = await productManager.getProducstBySort(sortOrder);
        res.send({ result: "success", payload: products });
    } catch (error) {
        throw error;
    };
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productsModel.deleteOne({ _id: pid });
    res.send({ result: "success", payload: result });
});

module.exports = router