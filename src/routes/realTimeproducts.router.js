const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('realTimeproducts.hbs');
});


module.exports = router;