import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    images: [
      {
        type: String,
        maxLength: 255,
      },
    ],
    price: {
      type: Number,
    },
    originalPrice: {
      type: Number,
    },
    slug: {
      type: String,
      maxLength: 255,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "Products",
    versionKey: false,
  }
);
const Products = mongoose.model("Products", productsSchema);

export default Products;
