const fs = require("fs").promises;
const getNextId = require("../helpers/getNextId.js");
const mongoose = require("mongoose");
const { productsModel } = require("../models/products.model.js");

class Product {
    constructor(productData, id) {
        this.title = productData.title;
        this.description = productData.description;
        this.price = productData.price;
        this.thumbnails = productData.thumbnails;
        this.code = productData.code;
        this.stock = productData.stock;
        this.status = true;
        this.category = productData.category;
        this._id = id;
    };
};

class ProductManager {

    constructor() {
        this.path = "./products.json";
    };

    readProduct = async () => {
        let products = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(products);
    };

    writeProduct = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    };

    exist = async (id) => {
        let products = await this.readProduct();
        id = parseInt(id);
        return products.find(product => product._id === id);
    };

    addProduct = async product => {
        const nextId = await getNextId();
        const newProduct = new Product(product, nextId);
        let productsOld = await this.readProduct();
        let productAll = [...productsOld, newProduct];
        await this.writeProduct(productAll);
        return { message: 'producto agregado', product };
    };

    getProducts = async () => {
        return await this.readProduct();
    };

    getProductsById = async (id) => {

        let productById = await this.exist(id);

        if (!productById) {
            return "El ID no existe";
        } else {
            return productById;
        };
    };

    updateProducts = async (id, product) => {
        let productById = await this.exist(id);
        if (!productById) return "Producto no encontrado";
        await this.deleteProducts(id);
        let productOld = await this.readProduct();
        let products = [{ ...product, id: id }, ...productOld];
        await this.writeProduct(products);
        return "Producto actualizado";
    };

    getProductsByLimit = async (limit) => {
        try {
            const products = await productsModel.find().limit(limit);
            if (products.length < limit) { limit = products.length; }
            return products;
        } catch (error) {
            throw error;
        }
    };

    getProductsByPage = async (page, productsPerPage) => {
        if (page <= 0) { page = 1; }
        try {
            const products = await productsModel.find()
                .skip((page - 1) * productsPerPage)
                .limit(productsPerPage);
            return products;
        } catch (error) {
            throw error;
        }
    };

    getProductsByQuery = async (query) => {
        try{
            const products = await products.find({
                description: {$regex: query, $options: 'i'}
            });
        } catch (error) {
            throw error;
        };

    };

    deleteProducts = async (id) => {
        let products = await this.readProduct();
        let existProduct = products.some(product => product._id === id);

        if (existProduct) {
            let productFilter = products.filter(product => product._id != id);
            await this.writeProduct(productFilter);
            return "Producto eliminado";
        } else {
            return "Producto no existe";
        };
    };

};

module.exports = { ProductManager, Product };