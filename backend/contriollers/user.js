import User from "../models/User.js";
import Product from "../models/Product.js";




export const viewUserDetails = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      userType: user.userType,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { firstName, lastName, email, contactNumber } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.contactNumber = contactNumber;
    await user.save();
    res.status(200).json({
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      userType: user.userType,
    });
  } catch (error) {
    next(error);
  }
};


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


export const placeOrder = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const user = await User.findById(userID).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderedProducts = [];

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      const orderedUnits = cartItem.count;

      if (orderedUnits > product.unitsAvailable) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      const order = {
        productID: product._id,
        title: product.title,
        thumbnailURL: product.thumbnailURL,
        sellerUsername: product.sellerUsername,
        unitsAvailable: product.unitsAvailable,
        productType: product.productType,
        bookingStartDate: cartItem.bookingStartDate,
        bookingEndDate: cartItem.bookingEndDate,
        rentedAtPrice: product.rentedAtPrice,
      };

      orderedProducts.push(order);

      product.unitsAvailable -= orderedUnits;
      await product.save();
    }

    user.cart = [];
    await user.save();

    res.status(200).json(orderedProducts);
  } catch (error) {
    next(error);
  }
};