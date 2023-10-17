const express = require("express");
const mongoose  = require("mongoose")
const http = require("http");
const socketIo = require("socket.io");
const Swal = require('sweetalert2');
const path = require("path");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const cartsRouter = require("./routes/carts.router");
const productsRouter = require("./routes/products.router");
const { ProductManager } = require("./services/productService");

const product = new ProductManager();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuracion de la carpeta views
app.use(express.static(__dirname, + "/views"));

//configuracion carpeta public    
app.use(express.static(path.join(__dirname, 'public')));

//rutas
app.use("/api/cart", cartsRouter);
app.use("/api/products", productsRouter);


// app.get("/chat", async (req, res) => {
//     res.render("chat.hbs", {title: "Chat"});
// });

//server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuhando por el puerto ${PORT}`);
});

//configuracion Mongoose
mongoose.connect("mongodb+srv://claudiaRolack:177022023007@cluster0.pfb4dhv.mongodb.net/?retryWrites=true&w=majority")
.then (() => {
    console.log("Conectado a la base de datos")
})
.catch (error => {
    console.log("Error al intentar conectarse a la BD", error)
})