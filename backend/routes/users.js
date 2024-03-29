import express from "express";
import {
  saveToWishlist,
  addToCart,
  placeOrder,
  viewUserDetails,
  updateUserDetails,
  getAllusers
} from "../contriollers/user.js";

const router = express.Router();
router.get("/", getAllusers)
router.get("/:username", viewUserDetails);
router.put("/:username", updateUserDetails);
router.put("/wishlist", saveToWishlist);
router.put("/cart", addToCart);
router.post("/order", placeOrder); 

export default router;
