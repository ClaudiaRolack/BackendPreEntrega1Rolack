const fs = require("fs").promises;
const mongoose = require("mongoose");
const cartId = require("../helpers/cartId.js");
const { ProductManager } = require("../services/productService.js");
const { cartsModel } = require("../models/carts.model.js");
const { productsModel } = require("../models/products.model.js");

const productAll = new ProductManager();

class CartManager {

    constructor() {
        this.path = "./cart.json";
    };

    readCart = async () => {
        let carts = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(carts);
    };

    writeCart = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    };

    exist = async (id) => {
        let carts = await this.readCart();
        id = parseInt(id);
        return carts.filter(cart => cart.id === id);
    };

    addCart = async () => {
        let cartOld = await this.readCart();
        let id = await cartId();
        let cartConcat = [...cartOld, { id: id, products: [] }];
        await this.writeCart(cartConcat);
        return "Carrito agregado";
    };

    getCarts = async () => {
        try {
            const carts = await CartManager.find({})
            .populate({
                path: "products.productId",
                model: "products",
                select: "title, description, price, stock"
            });
            return carts;
        } catch (error) {
            console.error("Error al obetener los carritos:", error);
            return "Error al obetener los carritos;"
        };
    };

    getCartWithProducts = async (cartId) => {
        try {
            const carts = await cartsModel.findById(cartId).populate("products.productsId").lean();
            console.log(cartId)
            if (!carts) {
                return "Carrito no encontrado";
            }

            return carts;
        } catch (error) {
            console.error("Error al obtener el carrito con los productos:", error);
            return "Error al obtener el carrito con los productos";
        };
    };

    updateProductsInCart = async (cartId, newProducts) => {
        try {
            const carts = await cartsModel.findById(cartId);
            if (!carts) {
                return "Carrito no encontrado";
            }
            carts.products = newProducts;

            await carts.save();
            return "Carrito actualizado con nuevos productos";
        } catch (error) {
            console.error("Error al actualizar el carrito con nuevos productos:", error);
            return "Error al actualizar el carrito con nuevos productos";
        };
    };

    updateProductInCart = async (cartId, prodId, newProduct) => {
        try {
            const carts = await cartsModel.findById(cartId);
            if (!carts) {
                return "Carrito no encontrado";
            };

            const productToUpdate = carts.products.find((product) => product.productId === prodId);
            if (!productToUpdate) {
                return "Producto no encontrado en el carrito";
            };

            Object.assign(productToUpdate, updatedProduct);
            await carts.save()
        } catch (error) {
            console.error("Error al actualizar el producto en el carrito:", error);
            return "Error al actualizar el producto en el carrito";
        };
    };

    removeProductFromCart = async (cartId, prodId) => {
        try {
            const carts = await cartsModel.findById(cartId);
            if (!carts) {
                return "Carrito no encontrado";
            };

            const productIndex = cart.products.findeIndex((product) => product.productId === prodId);
            if (productIndex !== -1) {
                carts.products.splice(productIndex, 1);
                await carts.save();
                return "Producto eliminado del carrito";
            } else {
                return "Producto no encontrado en el carrito";
            }
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            return "Error al eliminar el producto del carrito";
        };
    };

    removeAllProductsFromCart = async () => {
        try {
            const carts = await cartsModel.findById(cartId);
            if (!carts) {
                return "Carrito no encontrado";
            }

            carts.products = [];
            await carts.save();

            return "Todos los productos han sido eliminados del carrito";
        } catch (error) {
            console.error("Error al eliminar los productos del carrito:", error);
            return "Error al eliminar los productos del carrito";
        };
    };

};

module.exports = { CartManager };