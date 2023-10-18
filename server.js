const path = require("path");

// # express app require
const express = require("express");

const app = express();

// #cors
const cors = require("cors");
// Enable other domain access to your app
app.options("*", cors());
app.use(cors());

// #compression
const compression = require("compression");

// compress all responses
app.use(compression());

const { CheckoutWebHook } = require("./controller/Order.Controller");

// checkout webhook

app.post(
  "/checkout-webhook",
  express.raw({ type: "application/json" }),
  CheckoutWebHook
);

// # dotenv
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const PORT = process.env.PORT || 8000;

// # morgan require
const morgan = require("morgan");

// # database require
const DbConnection = require("./config/Database");

// # routes require

const mountRoutes = require("./routes");
// # handling Error
const ApiError = require("./utility/ApiError");

const GlobalError = require("./middlewares/ErrorMiddleWares");

// # database connection
DbConnection();

// # Middleware
app.use(express.static(path.join(__dirname, "uploads")));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node: ${process.env.NODE_ENV}`);
}

// # mount Routes
mountRoutes(app);

// # handling Error if  links not exist
app.all("*", (req, res, next) => {
  // const err = new Error(`cant find this route ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`cant find this route ${req.originalUrl}`, 400));
});
// # handling global error for express
app.use(GlobalError);

// # launch sever
const server = app.listen(PORT, () => {
  console.log(`server is working ${PORT}`);
});

// # handling error outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error ${err.name} || ${err.message}`);
  server.close(() => {
    console.error("shutdown...");
    process.exit(1);
  });
});
