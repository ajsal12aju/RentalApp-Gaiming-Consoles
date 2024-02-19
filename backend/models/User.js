import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["Seller", "Gamer"],
    required: true,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      count: {
        type: Number,
        required: true,
      },
      bookingStartDate: {
        type: Date,
        required: true,
      },
      bookingEndDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

export default mongoose.model("User", UserSchema);
