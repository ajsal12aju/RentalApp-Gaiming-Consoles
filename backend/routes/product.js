// productRoutes.js

import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../contriollers/product.js";

import { verifySeller } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifySeller, createProduct);
router.put("/:id", verifySeller, updateProduct);
router.delete("/:id", verifySeller, deleteProduct);
router.get("/find/:id", getProduct);
router.get("/", getProducts);

export default router;
