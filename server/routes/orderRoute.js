const express = require("express");
const {
  isUserAuthenticated,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.route("/order/new").post(isUserAuthenticated, newOrder);

orderRouter.route("/order/:id").get(isUserAuthenticated, getSingleOrder);

orderRouter.route("/orders/me").get(isUserAuthenticated, myOrders);

orderRouter
  .route("/admin/orders")
  .get(isUserAuthenticated, authorizeRoles("Admin"), getAllOrders);

orderRouter
  .route("/admin/order/:id")
  .put(isUserAuthenticated, authorizeRoles("Admin"), updateOrderStatus)
  .delete(isUserAuthenticated, authorizeRoles("Admin"), deleteOrder);

module.exports = orderRouter;
