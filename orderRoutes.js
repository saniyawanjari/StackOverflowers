import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { placeOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// GET  /orders/         — get all orders for logged-in user
router.get("/", protect, getMyOrders);

// POST /orders/place    — place a new order
router.post("/place", protect, placeOrder);

// PATCH /orders/:id/status — update order status (for admin/testing)
router.patch("/:id/status", protect, updateOrderStatus);

export default router;