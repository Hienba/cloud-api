import express from "express";
import { checkProductData } from "../middleware/validate.js";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", checkProductData, createProduct);
router.put("/:id", checkProductData, updateProduct);
router.delete("/:id", deleteProduct);
export default router;
