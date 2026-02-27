// Run this once to seed your MongoDB with products:
// node seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

const PRODUCTS = [
  {
    id: 1,
    name: "Slim Titanium Frame",
    brand: "LENSORA AIR",
    style: "Rectangle • Matte Black",
    category: "eyeglasses",
    shape: "rectangle",
    price: 2499, oldPrice: 4999, discount: "50%", badge: "BESTSELLER",
    colors: ["#1a1a1a", "#8B4513", "#C0C0C0"],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
    stock: 25,
    lensType: "single-vision",
    gender: "unisex",
    description: "Ultra-lightweight titanium frame with premium matte finish. Perfect for everyday wear with a sleek, minimalist look.",
    tags: ["bestseller", "titanium", "lightweight", "rectangle", "office"],
    rating: 4.8, reviews: 342,
  },
  {
    id: 2,
    name: "Retro Round Classic",
    brand: "VINCENT & CO",
    style: "Round • Tortoise",
    category: "eyeglasses",
    shape: "round",
    price: 1899, oldPrice: 3499, discount: "46%", badge: "NEW",
    colors: ["#6B3A2A", "#2d2d2d", "#B8860B"],
    image: "https://media.istockphoto.com/id/1221442384/photo/medicated-glasses.webp?a=1&b=1&s=612x612&w=0&k=20&c=RmH2-fwPtJvchZAhgC9oic1ya5jUk7SOXtVZcsia7ig=",
    stock: 18,
    lensType: "single-vision",
    gender: "unisex",
    description: "Classic round tortoise shell frame inspired by vintage styles. Timeless and fashionable for any face shape.",
    tags: ["retro", "round", "tortoise", "vintage", "classic"],
    rating: 4.6, reviews: 189,
  },
  {
    id: 3,
    name: "Aviator Gold Frame",
    brand: "LENSORA PRO",
    style: "Aviator • Gold Brown",
    category: "sunglasses",
    shape: "aviator",
    price: 3199, oldPrice: 5999, discount: "47%", badge: "SALE",
    colors: ["#B8860B", "#8B4513", "#1a1a1a"],
    image: "https://media.istockphoto.com/id/1133030612/photo/gold-glasses-metal-in-round-frame-transparent-for-reading-or-good-eye-sight-top-view-isolated.webp?a=1&b=1&s=612x612&w=0&k=20&c=L3BhXYWnYnBnZUune4wX65Eht3IkNSEk9-8ImZSZaKs=",
    stock: 12,
    lensType: "polarized",
    gender: "men",
    description: "Premium gold aviator with polarized lenses. UV400 protection with a bold, confident look perfect for outdoors.",
    tags: ["aviator", "gold", "polarized", "uv400", "premium", "men"],
    rating: 4.7, reviews: 256,
  },
  {
    id: 4,
    name: "Cat-Eye Chic",
    brand: "STUDIO BLUE",
    style: "Cat-Eye • Crystal Pink",
    category: "eyeglasses",
    shape: "cat-eye",
    price: 2299, oldPrice: 3999, discount: "43%", badge: "TRENDING",
    colors: ["#FFB6C1", "#9333ea", "#1a1a1a"],
    image: "https://media.istockphoto.com/id/1399784271/photo/fashionable-optical-glasses-on-a-white-background.jpg?s=612x612&w=0&k=20&c=VQuoBt5wOnflkg8OtmcYRCHRAFqLDQ-bQmfOcI-AxII=",
    stock: 20,
    lensType: "single-vision",
    gender: "women",
    description: "Trendy cat-eye frame in crystal pink. Flattering for oval and heart-shaped faces. A bold fashion statement.",
    tags: ["cat-eye", "women", "pink", "trendy", "fashionable", "oval-face"],
    rating: 4.9, reviews: 412,
  },
  {
    id: 5,
    name: "Anti-Blue Light Pro",
    brand: "LENSORA BLU",
    style: "Rectangle • Transparent",
    category: "computer",
    shape: "rectangle",
    price: 1699, oldPrice: 2999, discount: "43%", badge: "TECH",
    colors: ["#d1d5db", "#1a1a1a", "#3b82f6"],
    image: "https://media.istockphoto.com/id/1319309368/photo/eyeglasses-isolated-on-white-background-plastic-eyewear.jpg?s=612x612&w=0&k=20&c=I5oSOVZM-VwYuBtsFdYkPYRmGbwaAqH2fm7cLd0j1fY=",
    stock: 35,
    lensType: "anti-blue",
    gender: "unisex",
    description: "Advanced anti-blue light lenses that block 99% of harmful blue light from screens. Reduces eye strain and improves sleep quality.",
    tags: ["anti-blue", "computer", "screen", "tech", "eye-strain", "work-from-home", "blue-light"],
    rating: 4.7, reviews: 523,
  },
  {
    id: 6,
    name: "Wrap Sport Shield",
    brand: "SPORTZ VISION",
    style: "Shield • Matte Navy",
    category: "sport",
    shape: "shield",
    price: 3499, oldPrice: 6499, discount: "46%", badge: "SPORT",
    colors: ["#1e3a5f", "#e63946", "#1a1a1a"],
    image: "https://media.istockphoto.com/id/465134021/photo/sport-sunglasses.jpg?s=612x612&w=0&k=20&c=eWOGV7zUbd6CNrR5rDUg_IIpusDtoJo5ho40GgfU3lM=",
    stock: 8,
    lensType: "polarized",
    gender: "men",
    description: "High-performance sports shield with wrap-around design. Impact-resistant lenses with anti-fog coating. Perfect for cycling, running and outdoor sports.",
    tags: ["sport", "shield", "cycling", "running", "outdoor", "polarized", "impact-resistant"],
    rating: 4.6, reviews: 198,
  },
  {
    id: 7,
    name: "Gold Hexagonal",
    brand: "ROYALE OPTIC",
    style: "Hexagonal • Champagne",
    category: "luxury",
    shape: "hexagonal",
    price: 4299, oldPrice: 7999, discount: "46%", badge: "LUXURY",
    colors: ["#F5DEB3", "#B8860B", "#C0C0C0"],
    image: "https://media.istockphoto.com/id/952852728/photo/retro-yellow-sunglasses-on-the-white-background.jpg?s=612x612&w=0&k=20&c=GioHpTz_3TJYsV2vtiRGdNNsvs3QvoAQvCp1Vq3hFgs=",
    stock: 5,
    lensType: "polarized",
    gender: "women",
    description: "Exquisite hexagonal luxury frame in champagne gold. Hand-crafted with premium materials. A statement piece for formal occasions.",
    tags: ["luxury", "gold", "hexagonal", "premium", "formal", "women", "champagne"],
    rating: 4.9, reviews: 87,
  },
  {
    id: 8,
    name: "Floral Wayfarer",
    brand: "BLOOM FRAMES",
    style: "Wayfarer • Rose Fade",
    category: "eyeglasses",
    shape: "wayfarer",
    price: 1499, oldPrice: 2799, discount: "46%", badge: "NEW",
    colors: ["#FFB6C1", "#ff69b4", "#f8bbd9"],
    image: "https://media.istockphoto.com/id/488238873/photo/glasses.jpg?s=612x612&w=0&k=20&c=EEbLLeA9shiiiuXgf0UuTINl0jduK1W_Gi3ziiaAca4=",
    stock: 22,
    lensType: "single-vision",
    gender: "women",
    description: "Playful wayfarer in rose fade with floral-inspired color gradient. Lightweight acetate frame that's comfortable for all-day wear.",
    tags: ["wayfarer", "women", "pink", "floral", "casual", "lightweight", "acetate"],
    rating: 4.5, reviews: 134,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany({});
    console.log("🗑️  Cleared old products");

    await Product.insertMany(PRODUCTS);
    console.log(`✅ Seeded ${PRODUCTS.length} products into MongoDB!`);

    console.log("\n📦 Products in DB:");
    PRODUCTS.forEach(p => console.log(`  #${p.id} ${p.name} — Stock: ${p.stock} | Rs.${p.price}`));

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Done! Run 'node server.js' to start your server.");
    process.exit(0);
  }
}

seed();
