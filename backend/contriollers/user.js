import express from "express";
import { saveToWishlist, addToCart } from "../contriollers/user.js";

const router = express.Router();

router.put("/wishlist", saveToWishlist);
router.put("/cart", addToCart);

export default router;
