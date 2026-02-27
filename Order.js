import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,

  // Delivery details from checkout form
  deliveryDetails: {
    fullName: String,
    phone:    String,
    address:  String,
    city:     String,
    pincode:  String
  },

  // Order status — can be updated later for tracking
  status: {
    type: String,
    enum: ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Confirmed"
  },

  // Full status history for timeline tracking
  statusHistory: [
    {
      status:    String,
      message:   String,
      timestamp: { type: Date, default: Date.now }
    }
  ],

  paymentMethod: {
    type: String,
    default: "Cash on Delivery"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);