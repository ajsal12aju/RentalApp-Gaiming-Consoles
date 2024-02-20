import express from "express";
import { saveToWishlist, addToCart, placeOrder } from "../controllers/user.js";

const router = express.Router();

router.put("/wishlist", saveToWishlist);
router.put("/cart", addToCart);
router.post("/order", placeOrder); 

export default router;
