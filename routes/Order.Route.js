const express = require("express");

const {
  CreateCashOrder,
  GetAllOrders,
  GetOneOrder,
  createFilterObj,
  UpdateOrderToPaid,
  UpdateOrderToDelivered,
  CheckOutSession,
} = require("../controller/Order.Controller");

const Auth = require("../controller/Auth.Controller");

// # import  router
const Router = express.Router();

Router.use(Auth.Protect);
Router.get(
  "/checkout-session/:cartId",
  Auth.AllowedTo("user", "admin"),
  CheckOutSession
);
Router.route("/:cartId").post(Auth.AllowedTo("user", "admin"), CreateCashOrder);
Router.get(
  "/",
  Auth.AllowedTo("user", "admin", "manager"),
  createFilterObj,
  GetAllOrders
);
Router.get("/:id", GetOneOrder);
Router.put(
  "/:id/pay",
  Auth.AllowedTo("user", "admin", "manager"),
  UpdateOrderToPaid
);
Router.put(
  "/:id/deliver",
  Auth.AllowedTo("user", "admin", "manager"),
  UpdateOrderToDelivered
);
module.exports = Router;
