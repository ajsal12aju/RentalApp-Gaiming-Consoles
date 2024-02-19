import express from "express";
import { createProduct, deleteHotel, getHotel, getHotels, updateProduct } from "../contriollers/product.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post('/',verifyAdmin, createProduct);
router.put('/:id',verifyAdmin, updateProduct);
router.delete('/:id',verifyAdmin, deleteHotel);
router.get('/find/:id', getHotel);
router.get('/', getHotels);


export default router;
