import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id:          { type: Number, unique: true, required: true },
  name:        { type: String, required: true },
  brand:       { type: String, required: true },
  style:       { type: String },
  category:    { type: String, enum: ['eyeglasses','sunglasses','computer','sport','luxury','kids'], default: 'eyeglasses' },
  shape:       { type: String }, // rectangle, round, aviator, cat-eye, wayfarer, hexagonal, shield
  price:       { type: Number, required: true },
  oldPrice:    { type: Number },
  discount:    { type: String },
  badge:       { type: String },
  colors:      [String],
  image:       { type: String },
  stock:       { type: Number, default: 10 },
  lensType:    { type: String }, // single-vision, anti-blue, polarized, sport
  gender:      { type: String, enum: ['men','women','unisex','kids'], default: 'unisex' },
  description: { type: String },
  tags:        [String],
  rating:      { type: Number, default: 4.5 },
  reviews:     { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
