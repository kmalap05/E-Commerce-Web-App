const express = require("express");

const {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const {
  isUserAuthenticated,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const productRouter = express.Router();

productRouter.route("/products").get(getAllProducts);

productRouter
  .route("/admin/product/new")
  .post(isUserAuthenticated, authorizeRoles("Admin"), createNewProduct);

productRouter
  .route("/admin/product/:id")
  .put(isUserAuthenticated, authorizeRoles("Admin"), updateProduct)
  .delete(isUserAuthenticated, authorizeRoles("Admin"), deleteProduct);

productRouter.route("/product/:id").get(getProductDetails);

productRouter.route("/review").put(isUserAuthenticated, createProductReview);

productRouter
  .route("/reviews")
  .get(getProductReviews)
  .delete(isUserAuthenticated, deleteReview);

module.exports = productRouter;
