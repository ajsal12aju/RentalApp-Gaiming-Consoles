
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnailURL: {
    type: String,
    required: true,
  },
  sellerUsername: {
    type: String,
    required: true,
  },
  unitsAvailable: {
    type: Number,
    required: true,
  },
  productType: {
    type: String,
    enum: ["console", "controller", "game"],
    required: true,
  },
  productImages: {
    type: [String],
    required: true,
  },
  rentalPricePerWeek: {
    type: Number,
    required: true,
  },
  rentalPricePerMonth: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Product", ProductSchema);
