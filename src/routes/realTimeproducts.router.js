const express = require("express");
const router = express.Router();
const {ProductManager} = require("../services/productService")

const product = new ProductManager()

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeproducts.hbs');
});


module.exports = router;