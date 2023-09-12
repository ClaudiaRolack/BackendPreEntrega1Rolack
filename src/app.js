const express = require("express");
const path = require("path");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router"); 
const app = express();
const PORT = 8080;

//middlewars
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuracion carpeta public    
app.use(express.static(path.join(__dirname, 'public')));

//rutas
app.use("/api/products", productsRouter);
app.use("/", cartsRouter);

//ruta para servir el archivo .html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor escuhando por el puerto ${PORT}`);
});