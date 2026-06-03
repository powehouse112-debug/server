require('dotenv').config();
const mongoose = require('mongoose');

// ── Schemas (inline — no external imports needed) ─────────────────────────────

const productSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  description:     { type: String },
  category:        { type: String, required: true },
  image:           { type: String },
  sizes: [{
    size:  { type: String, required: true },
    price: { type: Number, required: true },
    ingredients: [{
      inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
      quantity:        { type: Number, required: true },
      unit: {
        type: String,
        enum: ['g','gram','grams','kg','half_kg','quarter_kg',
               'ml','milliliter','liter','half_liter',
               'pieces','piece','pcs','nos',''],
        default: '',
      },
    }],
  }],
  preparationTime: { type: Number, default: 15 },
  isAvailable:     { type: Boolean, default: true },
  branchId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
}, { timestamps: true });

const dealSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  products: [{
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    coldDrinkId: { type: mongoose.Schema.Types.ObjectId, ref: 'ColdDrink' },
    itemType:    { type: String, enum: ['product','cold_drink'], default: 'product' },
    size:        { type: String, required: true },
    quantity:    { type: Number, required: true, min: 1 },
  }],
  originalPrice:      { type: Number, required: true },
  discountedPrice:    { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  image:       { type: String },
  isActive:    { type: Boolean, default: true },
  validFrom:   { type: Date, required: true },
  validUntil:  { type: Date, required: true },
  branchId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
}, { timestamps: true });

const branchSchema = new mongoose.Schema({
  name: String, address: String, city: String,
  phone: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: String, role: String,
}, { timestamps: true });

const Product  = mongoose.models.Product  || mongoose.model('Product',  productSchema);
const Deal     = mongoose.models.Deal     || mongoose.model('Deal',     dealSchema);
const Branch   = mongoose.models.Branch   || mongoose.model('Branch',   branchSchema);
const User     = mongoose.models.User     || mongoose.model('User',     userSchema);

// ── Config ────────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌  MONGODB_URI .env mein set karo'); process.exit(1); }

// ── Full AMPF Menu Data ───────────────────────────────────────────────────────
// NOTE: ingredients array khaali hai — inventory IDs runtime par assign honge.
//       Agar tum ingredients bhi seed karna chahte ho, pehle inventory seed karo
//       aur phir yahan ObjectIds fill karo.

const MENU_PRODUCTS = [

  // ════════════════════════════════════════════════════════════════
  // SHAWARMAS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Shawarmas',
    name: 'Chicken Shawarma',
    sizes: [{ size: 'regular', price: 210, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Chicken Shawarma (L)',
    sizes: [{ size: 'large', price: 280, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Chicken Cheese Shawarma',
    sizes: [{ size: 'regular', price: 280, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Zinger Shawarma',
    sizes: [{ size: 'regular', price: 330, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Zinger Cheese Shawarma',
    sizes: [{ size: 'regular', price: 330, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Grill Shawarma',
    sizes: [{ size: 'regular', price: 310, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Arabian Shawarma',
    sizes: [{ size: 'regular', price: 310, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Vegetable Shawarma',
    sizes: [{ size: 'regular', price: 230, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Zinger Chicken Mix Shawarma',
    sizes: [{ size: 'regular', price: 290, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Bar B.Q Shawarma',
    sizes: [{ size: 'regular', price: 320, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Malai Botti Shawarma',
    sizes: [{ size: 'regular', price: 320, ingredients: [] }],
  },
  {
    category: 'Shawarmas',
    name: 'Special Shawarma',
    sizes: [{ size: 'regular', price: 360, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // SHAWARMA PLATTERS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Shawarma Platters',
    name: 'Shawarma Platter (Half)',
    sizes: [{ size: 'half', price: 440, ingredients: [] }],
  },
  {
    category: 'Shawarma Platters',
    name: 'Shawarma Platter (Full)',
    sizes: [{ size: 'full', price: 860, ingredients: [] }],
  },
  {
    category: 'Shawarma Platters',
    name: 'Grill Platter Shawarma',
    sizes: [{ size: 'regular', price: 650, ingredients: [] }],
  },
  {
    category: 'Shawarma Platters',
    name: 'Arabian Platter Shawarma',
    sizes: [{ size: 'regular', price: 650, ingredients: [] }],
  },
  {
    category: 'Shawarma Platters',
    name: 'Single Platter',
    sizes: [{ size: 'regular', price: 310, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // PARATHAS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Parathas',
    name: 'Chicken Paratha Roll',
    sizes: [{ size: 'regular', price: 310, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Chicken Cheese Paratha',
    sizes: [{ size: 'regular', price: 370, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Chicken Achari Paratha',
    sizes: [{ size: 'regular', price: 320, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Zinger Paratha',
    sizes: [{ size: 'regular', price: 360, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Cheese Zinger Paratha',
    sizes: [{ size: 'regular', price: 400, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Vegetable Paratha',
    sizes: [{ size: 'regular', price: 300, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Arabian Paratha',
    sizes: [{ size: 'regular', price: 400, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Grill Paratha',
    sizes: [{ size: 'regular', price: 400, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Pizza Paratha',
    sizes: [{ size: 'regular', price: 600, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Kabab Paratha',
    sizes: [{ size: 'regular', price: 410, ingredients: [] }],
  },
  {
    category: 'Parathas',
    name: 'Special Paratha',
    sizes: [{ size: 'regular', price: 430, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // PARATHA PLATTERS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Paratha Platters',
    name: 'Paratha Platter',
    sizes: [{ size: 'regular', price: 590, ingredients: [] }],
  },
  {
    category: 'Paratha Platters',
    name: 'Grill Paratha Platter',
    sizes: [{ size: 'regular', price: 790, ingredients: [] }],
  },
  {
    category: 'Paratha Platters',
    name: 'Arabian Paratha Platter',
    sizes: [{ size: 'regular', price: 790, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // BURGERS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Burgers',
    name: 'Zinger Burger',
    sizes: [{ size: 'regular', price: 350, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Shami Burger',
    sizes: [{ size: 'regular', price: 180, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Zinger Cheese Burger',
    sizes: [{ size: 'regular', price: 400, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Tower Burger',
    sizes: [{ size: 'regular', price: 540, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Mighty Burger',
    sizes: [{ size: 'regular', price: 540, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Petty Burger',
    sizes: [{ size: 'regular', price: 300, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Petty Cheese Burger',
    sizes: [{ size: 'regular', price: 350, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Chicken Burger',
    sizes: [{ size: 'regular', price: 290, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Grill Burger',
    sizes: [{ size: 'regular', price: 400, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Pizza Burger',
    sizes: [{ size: 'regular', price: 460, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Kabab Burger',
    sizes: [{ size: 'regular', price: 360, ingredients: [] }],
  },
  {
    category: 'Burgers',
    name: 'Doube Andda Burger',
    sizes: [{ size: 'regular', price: 230, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // CHICKEN FRIED
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Chicken Fried',
    name: '1 Piece Chicken Fried',
    sizes: [
      { size: 'small',  price: 250, ingredients: [] },
      { size: 'large',  price: 290, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // HOT WINGS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Hot Wings',
    name: 'Hot Wings',
    sizes: [
      { size: '5 piece',  price: 400, ingredients: [] },
      { size: '10 piece', price: 700, ingredients: [] },
    ],
  },
  {
    category: 'Hot Wings',
    name: 'Hot Shot Wings',
    sizes: [
      { size: '5 piece',  price: 450, ingredients: [] },
      { size: '10 piece', price: 820, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // OVEN BAKED WINGS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Oven Baked Wings',
    name: 'Oven Baked Wings',
    sizes: [
      { size: '5 piece',  price: 400, ingredients: [] },
      { size: '10 piece', price: 700, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // NUGGETS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Nuggets',
    name: 'Chicken Nuggets',
    sizes: [
      { size: '5 piece',  price: 300, ingredients: [] },
      { size: '10 piece', price: 500, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SOUP
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Soup',
    name: 'Chicken Soup',
    sizes: [{ size: 'regular', price: 120, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // PIZZA — Regular
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Pizza',
    name: 'Chicken Tikka Pizza',
    sizes: [
      { size: 'small',  price: 540,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Chicken Fajita Pizza',
    sizes: [
      { size: 'small',  price: 590,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Hot and Spicy Pizza',
    sizes: [
      { size: 'small',  price: 590,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Crispy Pizza',
    sizes: [
      { size: 'small',  price: 590,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Punjabi Chicken Pizza',
    sizes: [
      { size: 'small',  price: 590,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Bar B.Q Pizza',
    sizes: [
      { size: 'small',  price: 590,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Cheese Lover Pizza',
    sizes: [
      { size: 'small',  price: 540,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },
  {
    category: 'Pizza',
    name: 'Vegetable Pizza',
    sizes: [
      { size: 'small',  price: 540,  ingredients: [] },
      { size: 'medium', price: 890,  ingredients: [] },
      { size: 'large',  price: 1290, ingredients: [] },
      { size: 'xl',     price: 1890, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // PIZZA — AMPF Special
  // ════════════════════════════════════════════════════════════════
  {
    category: 'AMPF Special Pizza',
    name: 'Malai Botti Pizza',
    sizes: [
      { size: 'small',  price: 650,  ingredients: [] },
      { size: 'medium', price: 1090, ingredients: [] },
      { size: 'large',  price: 1450, ingredients: [] },
      { size: 'xl',     price: 2290, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Cheese Crust Pizza',
    sizes: [
      { size: 'small',  price: 650,  ingredients: [] },
      { size: 'medium', price: 1090, ingredients: [] },
      { size: 'large',  price: 1450, ingredients: [] },
      { size: 'xl',     price: 2190, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Crown Crust Pizza',
    sizes: [
      { size: 'small',  price: 650,  ingredients: [] },
      { size: 'medium', price: 1090, ingredients: [] },
      { size: 'large',  price: 1450, ingredients: [] },
      { size: 'xl',     price: 2190, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Seekh Kabab Pizza',
    sizes: [
      { size: 'small',  price: 690,  ingredients: [] },
      { size: 'medium', price: 1190, ingredients: [] },
      { size: 'large',  price: 1590, ingredients: [] },
      { size: 'xl',     price: 2390, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Bon Fire Pizza',
    sizes: [
      { size: 'small',  price: 650,  ingredients: [] },
      { size: 'medium', price: 1090, ingredients: [] },
      { size: 'large',  price: 1450, ingredients: [] },
      { size: 'xl',     price: 2190, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Kabab Crust Pizza',
    sizes: [
      { size: 'small',  price: 690,  ingredients: [] },
      { size: 'medium', price: 1190, ingredients: [] },
      { size: 'large',  price: 1590, ingredients: [] },
      { size: 'xl',     price: 2390, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Special Kabab Malai Pizza',
    sizes: [
      { size: 'small',  price: 690,  ingredients: [] },
      { size: 'medium', price: 1190, ingredients: [] },
      { size: 'large',  price: 1590, ingredients: [] },
      { size: 'xl',     price: 2390, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Lazania Pizza',
    sizes: [
      { size: 'small',  price: 690,  ingredients: [] },
      { size: 'medium', price: 1190, ingredients: [] },
      { size: 'large',  price: 1590, ingredients: [] },
      { size: 'xl',     price: 2390, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'Behari Kabab Pizza',
    sizes: [
      { size: 'small',  price: 700,  ingredients: [] },
      { size: 'medium', price: 1190, ingredients: [] },
      { size: 'large',  price: 1590, ingredients: [] },
      { size: 'xl',     price: 2390, ingredients: [] },
    ],
  },
  {
    category: 'AMPF Special Pizza',
    name: 'AMPF Special Pizza',
    sizes: [
      { size: 'small',  price: 700,  ingredients: [] },
      { size: 'medium', price: 1190, ingredients: [] },
      { size: 'large',  price: 1590, ingredients: [] },
      { size: 'xl',     price: 2390, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WRAPS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Wraps',
    name: 'Chicken Wrap',
    sizes: [{ size: 'regular', price: 290, ingredients: [] }],
  },
  {
    category: 'Wraps',
    name: 'Crunch Wrap',
    sizes: [{ size: 'regular', price: 340, ingredients: [] }],
  },
  {
    category: 'Wraps',
    name: 'Special Wrap',
    sizes: [{ size: 'regular', price: 470, ingredients: [] }],
  },
  {
    category: 'Wraps',
    name: 'Grill Wrap',
    sizes: [{ size: 'regular', price: 390, ingredients: [] }],
  },
  {
    category: 'Wraps',
    name: 'Arabian Wrap',
    sizes: [{ size: 'regular', price: 390, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // SANDWICHES
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Sandwiches',
    name: 'AMPF Special Sandwich',
    sizes: [{ size: 'regular', price: 570, ingredients: [] }],
  },
  {
    category: 'Sandwiches',
    name: 'Chicken Cheese Sandwich',
    sizes: [{ size: 'regular', price: 440, ingredients: [] }],
  },
  {
    category: 'Sandwiches',
    name: 'Pari Pari Sandwich',
    sizes: [{ size: 'regular', price: 490, ingredients: [] }],
  },
  {
    category: 'Sandwiches',
    name: 'Club Sandwich',
    sizes: [{ size: 'regular', price: 440, ingredients: [] }],
  },
  {
    category: 'Sandwiches',
    name: 'Vegetable Sandwich',
    sizes: [{ size: 'regular', price: 390, ingredients: [] }],
  },
  {
    category: 'Sandwiches',
    name: 'Grill Sandwich',
    sizes: [{ size: 'regular', price: 490, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // FRIES
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Fries',
    name: 'Regular Fries',
    sizes: [
      { size: 'small',  price: 150, ingredients: [] },
      { size: 'medium', price: 290, ingredients: [] },
      { size: 'large',  price: 440, ingredients: [] },
    ],
  },
  {
    category: 'Fries',
    name: 'Loaded Fries',
    sizes: [
      { size: 'small', price: 340, ingredients: [] },
      { size: 'large', price: 500, ingredients: [] },
    ],
  },
  {
    category: 'Fries',
    name: 'Salty Fries',
    sizes: [
      { size: 'small',  price: 150, ingredients: [] },
      { size: 'medium', price: 290, ingredients: [] },
      { size: 'large',  price: 440, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // PASTA
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Pasta',
    name: 'Chicken Macroni Pasta',
    sizes: [
      { size: 'half', price: 490, ingredients: [] },
      { size: 'full', price: 640, ingredients: [] },
    ],
  },
  {
    category: 'Pasta',
    name: 'Creamy Pasta',
    sizes: [
      { size: 'half', price: 520, ingredients: [] },
      { size: 'full', price: 680, ingredients: [] },
    ],
  },
  {
    category: 'Pasta',
    name: 'Crispy Pasta',
    sizes: [
      { size: 'half', price: 520, ingredients: [] },
      { size: 'full', price: 680, ingredients: [] },
    ],
  },
  {
    category: 'Pasta',
    name: 'AMPF Spec. Pasta',
    sizes: [
      { size: 'half', price: 630, ingredients: [] },
      { size: 'full', price: 820, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // DESSERTS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Desserts',
    name: 'Brownies',
    sizes: [{ size: 'regular', price: 360, ingredients: [] }],
  },
  {
    category: 'Desserts',
    name: 'Molten Lawa',
    sizes: [{ size: 'regular', price: 360, ingredients: [] }],
  },
  {
    category: 'Desserts',
    name: 'Russian Salad',
    sizes: [{ size: 'regular', price: 250, ingredients: [] }],
  },
  {
    category: 'Desserts',
    name: 'Ice Cream',
    sizes: [{ size: 'per scope', price: 80, ingredients: [] }],
  },

  // ════════════════════════════════════════════════════════════════
  // EXTRAS / SIDES
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Extras',
    name: 'Extra Bread',
    sizes: [{ size: 'regular', price: 40, ingredients: [] }],
  },
  {
    category: 'Extras',
    name: 'Extra Paratha',
    sizes: [{ size: 'regular', price: 90, ingredients: [] }],
  },
  {
    category: 'Extras',
    name: 'Extra Olive',
    sizes: [{ size: 'regular', price: 50, ingredients: [] }],
  },
  {
    category: 'Extras',
    name: 'Extra Cheese Slice',
    sizes: [{ size: 'regular', price: 50, ingredients: [] }],
  },
  {
    category: 'Extras',
    name: 'Dip Sauce',
    sizes: [{ size: 'regular', price: 50, ingredients: [] }],
  },
  {
    category: 'Extras',
    name: 'Extra Topping (Pizza)',
    sizes: [
      { size: 'small',  price: 50,  ingredients: [] },
      { size: 'medium', price: 100, ingredients: [] },
      { size: 'large',  price: 150, ingredients: [] },
    ],
  },
  {
    category: 'Extras',
    name: 'Extra Topping (Special Pizza)',
    sizes: [
      { size: 'small',  price: 80,  ingredients: [] },
      { size: 'medium', price: 160, ingredients: [] },
      { size: 'large',  price: 240, ingredients: [] },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SPECIAL ITEMS
  // ════════════════════════════════════════════════════════════════
  {
    category: 'Special Items',
    name: 'Chicken Cheese Stick',
    sizes: [{ size: 'regular', price: 590, ingredients: [] }],
  },
  {
    category: 'Special Items',
    name: 'Spin Roll',
    sizes: [{ size: 'regular', price: 590, ingredients: [] }],
  },
  {
    category: 'Special Items',
    name: 'Chicken Doner',
    sizes: [{ size: 'regular', price: 620, ingredients: [] }],
  },
];

// ── AM Special Deals Data ─────────────────────────────────────────────────────
// NOTE: products[] mein productId ko runtime par match karke fill kiya jayega
//       seed ke waqt product name se lookup karenge.

const DEALS_DATA = [
  {
    name: 'Deal 1 — Jumbo Family Deal',
    description: '1 Sm Pizza Tikka, 1 Medium Pizza, 1 Large Pizza, 10 Hot Wings, 4 Zinger Burger, 1 x 1.5L Bottle',
    discountedPrice: 4390,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'small',   qty: 1 },
      { name: 'Chicken Tikka Pizza', size: 'medium',  qty: 1 },
      { name: 'Chicken Tikka Pizza', size: 'large',   qty: 1 },
      { name: 'Hot Wings',           size: '10 piece',qty: 1 },
      { name: 'Zinger Burger',       size: 'regular', qty: 4 },
    ],
  },
  {
    name: 'Deal 2',
    description: '1 Small Tikka Pizza, 1 Zinger Burger, 1 Chicken Shawarma, 1 Liter Drink',
    discountedPrice: 1290,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'small',   qty: 1 },
      { name: 'Zinger Burger',       size: 'regular', qty: 1 },
      { name: 'Chicken Shawarma',    size: 'regular', qty: 1 },
    ],
  },
  {
    name: 'Deal 3',
    description: '1 Small Fajita Pizza, 1 Zinger Burger, 1 Petty Burger, 1 Liter Drink',
    discountedPrice: 1350,
    products: [
      { name: 'Chicken Fajita Pizza', size: 'small',   qty: 1 },
      { name: 'Zinger Burger',        size: 'regular', qty: 1 },
      { name: 'Petty Burger',         size: 'regular', qty: 1 },
    ],
  },
  {
    name: 'Deal 4',
    description: '1 Medium Tikka Pizza, 2 Zinger Burger, 1 Liter Drink',
    discountedPrice: 1690,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'medium',  qty: 1 },
      { name: 'Zinger Burger',       size: 'regular', qty: 2 },
    ],
  },
  {
    name: 'Deal 5',
    description: '2 Medium Tikka Pizza, 1.5 Liter Drink',
    discountedPrice: 1990,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'medium', qty: 2 },
    ],
  },
  {
    name: 'Deal 6',
    description: '1 Medium Tikka Pizza, 2 Zinger Burger, 6 Hot Wings, 1 Liter Drink',
    discountedPrice: 2090,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'medium',   qty: 1 },
      { name: 'Zinger Burger',       size: 'regular',  qty: 2 },
      { name: 'Hot Wings',           size: '5 piece',  qty: 1 },
    ],
  },
  {
    name: 'Deal 7',
    description: '1 Large Fajita Pizza, 1 Medium Tikka Pizza, 10 Hot Wings, 1.5 Liter Drink',
    discountedPrice: 3190,
    products: [
      { name: 'Chicken Fajita Pizza', size: 'large',    qty: 1 },
      { name: 'Chicken Tikka Pizza',  size: 'medium',   qty: 1 },
      { name: 'Hot Wings',            size: '10 piece', qty: 1 },
    ],
  },
  {
    name: 'Deal 8',
    description: '1 Large Pizza, 4 Zinger Burger, 10 Hot Wings, 1.5 Liter Drink',
    discountedPrice: 3490,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'large',    qty: 1 },
      { name: 'Zinger Burger',       size: 'regular',  qty: 4 },
      { name: 'Hot Wings',           size: '10 piece', qty: 1 },
    ],
  },
  {
    name: 'Deal 9',
    description: '2 Large Tikka Pizza, 1.5 Liter Drink',
    discountedPrice: 2890,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'large', qty: 2 },
    ],
  },
  {
    name: 'Deal 10',
    description: '1 Fries, 1 Zinger Burger, 1 Reg. Drink',
    discountedPrice: 530,
    products: [
      { name: 'Regular Fries', size: 'small',   qty: 1 },
      { name: 'Zinger Burger', size: 'regular', qty: 1 },
    ],
  },
  {
    name: 'Deal 11',
    description: '1 Pasta, 1 Chicken Cheese Stick, 1 Liter Drink',
    discountedPrice: 1140,
    products: [
      { name: 'Creamy Pasta',         size: 'full',    qty: 1 },
      { name: 'Chicken Cheese Stick', size: 'regular', qty: 1 },
    ],
  },
  {
    name: 'Deal 12',
    description: '1 Spin Roll, 1 Loaded Fries, 1 Liter Drink',
    discountedPrice: 990,
    products: [
      { name: 'Spin Roll',    size: 'regular', qty: 1 },
      { name: 'Loaded Fries', size: 'small',   qty: 1 },
    ],
  },
  {
    name: 'Deal 13',
    description: '1 Pizza Paratha, 5 Hot Wings, 1 Zinger Burger, 1 Fries, 1 Liter Drink',
    discountedPrice: 1450,
    products: [
      { name: 'Pizza Paratha', size: 'regular', qty: 1 },
      { name: 'Hot Wings',     size: '5 piece', qty: 1 },
      { name: 'Zinger Burger', size: 'regular', qty: 1 },
      { name: 'Regular Fries', size: 'small',   qty: 1 },
    ],
  },
  {
    name: 'Deal 14',
    description: '2 Small Pizza, 1 Liter Drink',
    discountedPrice: 1390,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'small', qty: 2 },
    ],
  },
  {
    name: 'Deal 15',
    description: '6 Chicken Shawarma, 1 x 1.5 Liter Drink',
    discountedPrice: 1490,
    products: [
      { name: 'Chicken Shawarma', size: 'regular', qty: 6 },
    ],
  },
  {
    name: 'Deal 16',
    description: '8 Zinger Shawarma, 1 x 1.5 Liter Drink',
    discountedPrice: 2290,
    products: [
      { name: 'Zinger Shawarma', size: 'regular', qty: 8 },
    ],
  },
  {
    name: 'Deal 17',
    description: '7 Zinger Burger, 1 x 1.5 Liter Drink',
    discountedPrice: 2390,
    products: [
      { name: 'Zinger Burger', size: 'regular', qty: 7 },
    ],
  },
  {
    name: 'Jumbo Deal',
    description: '3 Large Pizza, 2 Medium Pizza, 6 Zinger Burger, 15 Hot Wings, 1 Medium Fries, 2 x 1.5L Drink',
    discountedPrice: 9990,
    products: [
      { name: 'Chicken Tikka Pizza', size: 'large',    qty: 3 },
      { name: 'Chicken Tikka Pizza', size: 'medium',   qty: 2 },
      { name: 'Zinger Burger',       size: 'regular',  qty: 6 },
      { name: 'Hot Wings',           size: '10 piece', qty: 1 },
      { name: 'Hot Wings',           size: '5 piece',  qty: 1 },
      { name: 'Regular Fries',       size: 'medium',   qty: 1 },
    ],
  },
];

// ── Helper: calculate originalPrice & discountPercentage ─────────────────────
function calcDealPricing(deal, productMap) {
  let original = 0;
  for (const item of deal.products) {
    const prod = productMap[item.name];
    if (!prod) continue;
    const sizeObj = prod.sizes.find(s => s.size === item.size);
    if (sizeObj) original += sizeObj.price * item.qty;
  }
  if (original === 0) original = Math.round(deal.discountedPrice * 1.25);
  const discountPct = original > 0
    ? Math.round(((original - deal.discountedPrice) / original) * 100)
    : 0;
  return { originalPrice: original, discountPercentage: discountPct };
}

// ── Main Seed Function ────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  MongoDB connected\n');

  // Fetch active branch
  const branch = await mongoose.model('Branch').findOne({ isActive: true }).lean();
  if (!branch) { console.error('❌  Koi active branch nahi mili'); process.exit(1); }
  console.log(`🏢  Branch: ${branch.name} — ${branch.city} | ${branch._id}\n`);

  // Fetch any admin/manager user
  const user = await mongoose.model('User').findOne({}).lean();
  if (!user) { console.error('❌  Koi user nahi mila DB mein'); process.exit(1); }
  console.log(`👤  User: ${user.name || user.email} | ${user._id}\n`);

  const branchId = branch._id;
  const createdBy = user._id;
  const now = new Date();
  const farFuture = new Date('2099-12-31');

  // ── STEP 1: Seed Products ──────────────────────────────────────────────────
  console.log('━━━ Seeding Products ━━━');
  const productNameToDoc = {};

  for (const p of MENU_PRODUCTS) {
    const existing = await Product.findOne({ name: p.name, branchId });
    if (existing) {
      // Update prices/sizes — upsert style
      existing.sizes = p.sizes;
      existing.category = p.category;
      existing.preparationTime = existing.preparationTime || 15;
      await existing.save();
      productNameToDoc[p.name] = existing;
      console.log(`  ↻  Updated : [${p.category}] ${p.name}`);
    } else {
      const created = await Product.create({
        name: p.name,
        description: p.description || '',
        category: p.category,
        sizes: p.sizes,
        preparationTime: 15,
        isAvailable: true,
        branchId,
        createdBy,
      });
      productNameToDoc[p.name] = created;
      console.log(`  ✓  Created : [${p.category}] ${p.name}`);
    }
  }
  console.log(`\n📦  Total products processed: ${MENU_PRODUCTS.length}\n`);

  // ── STEP 2: Seed Deals ─────────────────────────────────────────────────────
  console.log('━━━ Seeding Deals ━━━');
  let dealsCreated = 0;
  let dealsUpdated = 0;

  for (const d of DEALS_DATA) {
    const { originalPrice, discountPercentage } = calcDealPricing(d, productNameToDoc);

    // Build products array with real ObjectIds
    const dealProducts = d.products
      .map(item => {
        const prod = productNameToDoc[item.name];
        if (!prod) {
          console.warn(`  ⚠️  Product not found for deal "${d.name}": ${item.name}`);
          return null;
        }
        return {
          productId: prod._id,
          itemType:  'product',
          size:      item.size,
          quantity:  item.qty,
        };
      })
      .filter(Boolean);

    const dealPayload = {
      name:               d.name,
      description:        d.description || '',
      products:           dealProducts,
      originalPrice,
      discountedPrice:    d.discountedPrice,
      discountPercentage,
      isActive:           true,
      validFrom:          now,
      validUntil:         farFuture,
      branchId,
      createdBy,
    };

    const existing = await mongoose.model('Deal').findOne({ name: d.name, branchId });
    if (existing) {
      await mongoose.model('Deal').updateOne({ _id: existing._id }, { $set: dealPayload });
      console.log(`  ↻  Updated : ${d.name} — Rs. ${d.discountedPrice} (${discountPercentage}% off)`);
      dealsUpdated++;
    } else {
      await mongoose.model('Deal').create(dealPayload);
      console.log(`  ✓  Created : ${d.name} — Rs. ${d.discountedPrice} (${discountPercentage}% off)`);
      dealsCreated++;
    }
  }

  console.log(`\n🎉  Deals created: ${dealsCreated} | updated: ${dealsUpdated}\n`);
  console.log('━━━ Summary ━━━');
  console.log(`  Products : ${MENU_PRODUCTS.length} items across ${[...new Set(MENU_PRODUCTS.map(p => p.category))].length} categories`);
  console.log(`  Deals    : ${DEALS_DATA.length} deals seeded`);
  console.log('\n✅  Seed complete!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});