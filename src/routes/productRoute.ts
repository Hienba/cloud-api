import express from "express";
import productCtrl from "../controllers/productCtrl";
import { checkProductData } from "../middleware/validate";

const router = express.Router();

router.get("/", productCtrl.getProducts);

router.get("/:id", productCtrl.getProduct);

router.post("/", checkProductData, productCtrl.addProduct);

router.put("/:id", checkProductData, productCtrl.updateProduct);

router.delete("/:id", productCtrl.deleteProduct);

export default router;
