import express from "express";
import { getProducts, getProductById, getAllStock, updateStock } from "../controllers/productController.js";

const router = express.Router();

router.get("/",             getProducts);       // GET /api/products?search=&category=&shape=
router.get("/stock/all",    getAllStock);        // GET /api/products/stock/all  (for chatbot)
router.get("/:id",          getProductById);    // GET /api/products/3
router.patch("/:id/stock",  updateStock);       // PATCH /api/products/3/stock  { stock: 15 }

export default router;
