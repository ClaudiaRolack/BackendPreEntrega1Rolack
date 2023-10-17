const { Router } = require("express");
const mongoose = require("mongoose");
const { productsModel } = require("../models/products.model");
const { ProductManager } = require("../services/productService");

const productManager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const query = req.query.q;
        const category = req.query.category;
        const availability = req.query.availability;
        const sortOrder = req.query.sort == "desc" ? -1 : 1;

        const queryObject = {};

        if (query) { queryObject.title = { $regex: query, $options: 'i' };
        }

        if (category) { queryObject.category = category;
        }

        if (availability) { queryObject.availability = availability;
        }

        const options = {
            page: page,
            limit: limit,
            sort: { price: sortOrder },
        };

        const result = await productsModel.paginate(queryObject, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prePage: result.hasPrevPage ? page - 1 : null,
            nextPage: result.hasNextPage ? page + 1 : null,
            page: page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
        });
    } catch (error) {
        throw error;
    }
});
router.post("/", async (req, res) => {
    try {
        let { title, description, category, price, code, stock, availability } = req.body;

        if (!title || !description || !price || !code) {
            return res.status(400).json({ status: "error", error: "Faltan datos obligatorios" });
        }

        if (stock === undefined) {
            stock = 0;
        }

        if (availability !== "inStock" && availability !== "outOfStock") {
            return res.status(400).json({ status: "error", error: "El valor de disponibilidad es inválido" });
        }

        const result = await productsModel.create({ title, description, category, price, code, stock, availability });
        return res.status(201).json({ result: "success", payload: result });
    } catch (error) {
        return res.status(500).json({ status: "error", error: error.message });
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
    };
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

//paginate
// http://localhost:8080/api/products/?q=titulo&category=electronica
// http://localhost:8080/api/products/?q=titulo
// http://localhost:8080/api/products/?category=electronica
// http://localhost:8080/api/products/?sort=asc
// http://localhost:8080/api/products/?sort=desc
// http://localhost:8080/api/products/?q=titulo&category=electronica&sort=desc
// http://localhost:8080/api/products/?category=electronica&availability=outOfStock&sort=asc