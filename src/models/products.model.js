const mongoose = require("mongoose");

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, max: 20, required: true },
    description: { type: String, max: 100, required: true },
    price: { type: Number, required: true },
    code: { type: String, max: 30, required: true },
    stock: { type: Number, required: true }
})

const productsModel = mongoose.model(productsCollection, productsSchema)

module.exports =  { productsModel }  