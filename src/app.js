const express = require("express");
const http = require("http")
const socketio = require("socket.io")
const path = require("path");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars")
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router"); 
const viewsRouter = require("./routes/views.router")


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;


//configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");



//middlewars
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuracion de la carpeta views
app.use(express.static(__dirname, + "/views"))

//configuracion carpeta public    
app.use(express.static(path.join(__dirname, 'public')));

//rutas

// app.get("/realtimeproducts", async (req, res) => {
//     let allProducts = await product.getProducts()
//     res.render("realTimeproducts.hbs",{
//         products : allProducts
//     })
// })

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/home", viewsRouter);

//configuracion websockets

// io.on("connection", (data) => {
//     console.log('Producto agregado');

//     socket.on('newProduct', (username) => {
//         product[socket.id] = username;
//         io.emit('userConnected', username);
//     });
    
// })

//ruta para servir el archivo .html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Servidor escuhando por el puerto ${PORT}`);
});