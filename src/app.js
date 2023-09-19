const express = require("express");
const http = require("http")
const socketIo = require("socket.io")
const path = require("path");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars")
const Swal = require('sweetalert2');
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router"); 
const viewsRouter = require("./routes/views.router")
const realTimeproducts = require("./routes/realTimeproducts.router")
const {ProductManager} = require("./services/productService")

const product = new ProductManager()


const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/home", viewsRouter);
app.use("/realtimeproducts", realTimeproducts)




//configuracion socket.io
io.on('connection', (socket) => { 


    54

    console.log('a user connected')

    socket.on('addProduct', (productData) => {
        newProducts[socket.id] = product.addProduct(productData);
        io.emit('productAdded', newProducts);
        
    });

    socket.on('removeProduct', () => {
        const removeProduct = newProducts[socket.id];
        delete newProducts[socket.id];
        io.emit('productRemoved', removeProduct);
    });

});


//server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuhando por el puerto ${PORT}`);
});