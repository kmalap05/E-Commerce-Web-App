const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;

  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product, req.query);

  apiFeatures.search();

  apiFeatures.filter();

  apiFeatures.pagination(resultPerPage);

  const products = await apiFeatures.query;

  if (!products) {
    return next(new ErrorHandler("No Products Available!", 200));
  }

  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

// Create New Product -- ADMIN
const createNewProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const requiredFields = [
    "name",
    "description",
    "price",
    "images",
    "category",
    "stock",
    "user",
  ];

  if (requiredFields.some((field) => !req.body[field])) {
    return next(new ErrorHandler("All Fields Are Required!", 500));
  }

  const newProduct = await Product.create(req.body);

  res.status(200).json({
    success: true,
    newProduct,
  });
});

// Update Product -- ADMIN
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found!", 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    updatedProduct,
  });
});

// Delete Product -- ADMIN
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found!", 404));
  }

  const deletedProduct = await Product.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully!",
  });
});

const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found!", 404));
  }

  const productDetails = await Product.findById(req.params.id);

  res.status(200).json({
    success: true,
    productDetails,
  });
});

const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() == req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() == req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews Of The Product
const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found!", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found!", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  reviews.length == 0 ? (ratings = 0) : (ratings = avg / reviews.length);

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  createNewProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
};
