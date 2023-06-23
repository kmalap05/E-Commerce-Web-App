const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      comment: "The name of the product.",
    },
    description: {
      type: String,
      required: true,
      comment: "The description of the product.",
    },
    price: {
      type: Number,
      required: true,
      maxLength: 8,
      comment: "The price of the product.",
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
          comment: "The public ID of the image.",
        },
        url: {
          type: String,
          required: true,
          comment: "The URL of the image.",
        },
      },
    ],
    category: {
      type: String,
      required: true,
      comment: "The category of the product.",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    stock: {
      type: Number,
      maxLength: 4,
      default: 1,
      comment: "The stock of the product.",
    },
    ratings: {
      type: Number,
      default: 0,
      comment: "The ratings of the product.",
    },
    numOfReviews: {
      type: Number,
      default: 0,
      comment: "The number of reviews of the product.",
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "users",
          required: true,
        },
        name: {
          type: String,
          required: true,
          comment: "The name of the reviewer.",
        },
        rating: {
          type: Number,
          required: true,
          comment: "The rating of the product.",
        },
        comment: {
          type: String,
          required: true,
          comment: "The comment of the reviewer.",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;
