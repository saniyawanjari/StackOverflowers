import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes  from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Order       from "./models/Order.js";

dotenv.config();

const app = express();

// ✅ CORS must explicitly allow Authorization header
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/orders",   orderRoutes);

// Test route
app.get("/api/auth/test", (req, res) => {
  res.json({ msg: "Backend is running ✅" });
});

// Debug route — manually trigger progression for ALL pending orders right now
app.get("/api/debug/progress-orders", async (req, res) => {
  try {
    const statuses = ["Confirmed", "Processing", "Shipped", "Out for Delivery"];
    const messages = {
      "Confirmed":        { to: "Processing",       msg: "Your order is being prepared by our team!" },
      "Processing":       { to: "Shipped",          msg: "Your order has been shipped and is on the way! 🚚" },
      "Shipped":          { to: "Out for Delivery", msg: "Your order is out for delivery. Expect it soon!" },
      "Out for Delivery": { to: "Delivered",        msg: "Your order has been delivered. Enjoy your new eyewear! 🎉" },
    };

    const orders = await Order.find({ status: { $in: statuses } });
    const updated = [];

    for (const order of orders) {
      const next = messages[order.status];
      if (!next) continue;
      order.status = next.to;
      order.statusHistory.push({ status: next.to, message: next.msg, timestamp: new Date() });
      await order.save();
      updated.push({ id: order._id, newStatus: next.to });
    }

    res.json({ msg: `✅ Advanced ${updated.length} orders`, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startAutoStatusProgression(); // 🚀 kick off the auto-updater
  })
  .catch(err => console.log("❌ MongoDB error:", err));

app.listen(8000, () => {
  console.log("🚀 Server running on port 8000");
});

// ─────────────────────────────────────────────────────────────────
// AUTO STATUS PROGRESSION ENGINE
// Simulates real-world order updates:
//   Confirmed        → Processing       (after 1 min)
//   Processing       → Shipped          (after 2 mins)
//   Shipped          → Out for Delivery (after 3 mins)
//   Out for Delivery → Delivered        (after 2 mins)
// ─────────────────────────────────────────────────────────────────

const STATUS_PIPELINE = [
  {
    from:    "Confirmed",
    to:      "Processing",
    delayMs: 30 * 1000,   // 30 seconds
    message: "Your order is being prepared by our team!",
  },
  {
    from:    "Processing",
    to:      "Shipped",
    delayMs: 30 * 1000,   // 30 seconds
    message: "Your order has been shipped and is on the way! 🚚",
  },
  {
    from:    "Shipped",
    to:      "Out for Delivery",
    delayMs: 30 * 1000,   // 30 seconds
    message: "Your order is out for delivery. Expect it soon!",
  },
  {
    from:    "Out for Delivery",
    to:      "Delivered",
    delayMs: 30 * 1000,   // 30 seconds
    message: "Your order has been delivered. Enjoy your new eyewear! 🎉",
  },
];

async function runProgression() {
  try {
    const now = new Date();
    console.log("⏱️  Running status check...");

    for (const stage of STATUS_PIPELINE) {
      const orders = await Order.find({ status: stage.from });
      console.log(`   Found ${orders.length} orders at status: ${stage.from}`);

      for (const order of orders) {
        const stageEntry = [...order.statusHistory]
          .reverse()
          .find(h => h.status === stage.from);

        // If no history entry found, use order createdAt as fallback
        const enteredAt = stageEntry ? new Date(stageEntry.timestamp) : new Date(order.createdAt);
        const elapsed   = now - enteredAt;

        console.log(`   Order ${order._id}: elapsed ${Math.round(elapsed/1000)}s, needs ${stage.delayMs/1000}s`);

        if (elapsed >= stage.delayMs) {
          order.status = stage.to;
          order.statusHistory.push({
            status:    stage.to,
            message:   stage.message,
            timestamp: new Date(),
          });
          await order.save();
          console.log(`✅ Order ${order._id}: ${stage.from} → ${stage.to}`);
        }
      }
    }
  } catch (err) {
    console.error("❌ Auto-progression error:", err.message);
  }
}

function startAutoStatusProgression() {
  console.log("⏱️  Auto status progression engine started");
  runProgression(); // ✅ run immediately on server start (fixes old stuck orders)
  setInterval(runProgression, 30 * 1000); // then every 30 seconds
}