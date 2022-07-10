import express from "express";
import productCtrl from "../controllers/productCtrl";
import { checkProductData } from "../middleware/validate";

const router = express.Router();

router.get("/products", productCtrl.getProducts);

router.get("/products/:id", productCtrl.getProduct);

router.post("/products", checkProductData, productCtrl.addProduct);

router.put("/products/:id", checkProductData, productCtrl.updateProduct);

router.delete("/products/:id", productCtrl.deleteProduct);

export default router;
