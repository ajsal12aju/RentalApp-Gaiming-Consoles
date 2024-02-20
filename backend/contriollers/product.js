
import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
    console.log(req.body, "========req======");
  try {
    const {
      title,
      thumbnailURL,
      sellerUsername,
      unitsAvailable,
      productType,
      productImages,
      rentalPricePerWeek,
      rentalPricePerMonth,
    } = req.body;

    if (
      !title ||
      !thumbnailURL ||
      !sellerUsername ||
      !unitsAvailable ||
      !productType ||
      !rentalPricePerWeek ||
      !rentalPricePerMonth
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newProduct = new Product({
      title,
      thumbnailURL,
      sellerUsername,
      unitsAvailable,
      productType,
      productImages,
      rentalPricePerWeek,
      rentalPricePerMonth,
    });
    console.log(newProduct, "========newProduct======");

    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error, '========error=====');
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json("Product is not available")
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
        res.status(404).json("Products is not available");
    next(error);
  }
};
