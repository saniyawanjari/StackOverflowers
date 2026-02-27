import Order from "../models/Order.js";

// POST /orders/place
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryDetails } = req.body;

    // req.user comes from authMiddleware — it's the decoded JWT payload { id: user._id }
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      deliveryDetails,
      status: "Confirmed",
      paymentMethod: "Cash on Delivery",
      statusHistory: [
        {
          status:    "Confirmed",
          message:   "Your order has been placed successfully!",
          timestamp: new Date()
        }
      ]
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET /orders/
export const getMyOrders = async (req, res) => {
  try {
    // Fetch all orders for this user, newest first
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PATCH /orders/:id/status  (admin use — update order status)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    const validStatuses = ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    order.statusHistory.push({
      status,
      message: message || `Order status updated to ${status}`,
      timestamp: new Date()
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};