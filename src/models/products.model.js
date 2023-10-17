const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, max: 20, required: true },
    description: { type: String, max: 100, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    code: { type: String, max: 30, required: true },
    stock: { type: Number },
    availability: { type: String, enum: ["inStock", "outOfStock"] }
})

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productsSchema)

module.exports =  { productsModel }  