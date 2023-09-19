const fs = require("fs").promises;
const cartId = require("../helpers/cartId.js");
const { ProductManager } = require("../services/productService.js");

const productAll = new ProductManager()

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
    }

    getCartById = async (id) => {
        let cartById = await this.exist(id);
        if (!cartById) { return "El ID no existe" } else { return cartById };
    };

    addProductCarts = async (cartId, productId) => {
        let cartById = await this.exist(cartId);

        if (!cartById) return "El carrito no existe";

        let productById = await productAll.exist(productId);

        if (!productById) return "El producto no existe";

        let cartAll = await this.readCart();

        let cartFilter = cartAll.find(cart => cart.id === cartId);

        if (cartFilter) {
            let productInCart = cartFilter.products.find(prod => prod.id === productId);

            if (productInCart) {

                productInCart.cantidad++;
            } else {
                cartFilter.products.push({ id: productById._id, cantidad: 1 });
            }

            await this.writeCart(cartAll);
            return "Cantidad del producto en el carrito actualizada o producto agregado al carrito";
        } else {
            return "El carrito no existe";
        }
    }

}

module.exports = { CartManager };