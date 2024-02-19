import User from "../models/User.js";
import Product from "../models/Product.js";

export const saveToWishlist = async (req, res, next) => {
  try {
    const { userID, productID } = req.body;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const index = user.wishlist.indexOf(productID);
    if (index === -1) {
      user.wishlist.push(productID);
    } else {
      user.wishlist.splice(index, 1);
    }
    await user.save();
    res.status(200).json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { userID, productID, count, bookingStartDate, bookingEndDate } =
      req.body;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const cartItem = {
      product: productID,
      count,
      bookingStartDate,
      bookingEndDate,
    };
    user.cart.push(cartItem);
    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    next(error);
  }
};
