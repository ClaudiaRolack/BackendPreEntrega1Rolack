const express = require("express");
const mongoose  = require("mongoose")
const MongoStore = require("connect-mongo");
const session = require("express-session");
const FileStore = require("session-file-store");
const http = require("http");
const socketIo = require("socket.io");
const Swal = require('sweetalert2');
const path = require("path");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const cartsRouter = require("./routes/carts.router");
const productsRouter = require("./routes/products.router");
const userRouter = require("./routes/user.router")
const { ProductManager } = require("./services/productService");
const { CartManager } = require("./services/cartService");

const app = express();
 
const product = new ProductManager();
const cart = new CartManager();

const fileStorages = FileStore(session); 

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

//configuracion Mongoose
mongoose.connect("mongodb+srv://claudiaRolack:177022023007@cluster0.pfb4dhv.mongodb.net/?retryWrites=true&w=majority")
.then (() => {
    console.log("Conectado a la base de datos")
})
.catch (error => {
    console.log("Error al intentar conectarse a la BD", error)
})

//session
app.use(session({
    store: MongoStore.create({
        mongoUrl:  "mongodb+srv://claudiaRolack:177022023007@cluster0.pfb4dhv.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedToPology: true }, 
        ttl: 3600
    }),
    secret: "ClaveSecreta",
    resave: false,
    saveUninitialized: false
}));

//rutas
app.use("/api/cart", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", userRouter)

app.get("/products", async (req, res) => {
    if (!req.session.emailUsuario) {
        return res.redirect("/login")
    }
    let allProducts = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON())
    res.render("viewProducts", {
        title: "Productos",
        products: allProducts,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario
    });
});

app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid;
    let allCarts = await cart.getCartWithProducts(id);
    res.render("viewCart", {
        title: "Carrito",
        carts: allCarts
    });
});

app.get("/products", async (req, res) => {
    let allProducts = await product.getProducts();
    allProducts = allProducts.map(product => product.toJSON());
    res.render("viewProducts", {
        title: "Lista de productos",
        products: allProducts
    });
});

app.get("login", async (req, res) => {
    res.render("login", {
        title: "Login"
    });
});

app.get("/register", async (req, res) => {
    res.render("register", {
       title: "Register" 
    });
});

app.get("/profile", async (req, res) => {
    if (!req.session.emailUsuario) {
        return res.redirect("/login")
    }
    res.render("profile", {
        title: "Profile Admin",
        firstName: req.session.nombreUsuario,
        lastName: req.session.apellidoUsuario,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario
    })
});

//server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuhando por el puerto ${PORT}`);
});