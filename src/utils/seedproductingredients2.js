/**
 * seedProductIngredients.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Inventory names: seedInventory.js ke exact names use kiye hain
 *
 * USAGE:
 *   node seedProductIngredients.js              # safe run (skip already filled)
 *   node seedProductIngredients.js --list       # DB categories + inventory print
 *   node seedProductIngredients.js --dry-run    # preview only, kuch save nahi
 *   node seedProductIngredients.js --force      # overwrite existing ingredients
 *
 * SCALING RULE (smallQty = SMALL size ka base):
 *   small / half / per scope → base qty (offset 0)
 *   regular / full           → base + 20g / +0.02kg
 *   medium                   → base + 20g / +0.02kg
 *   large                    → base + 40g / +0.04kg
 *   xl / extra               → base + 60g / +0.06kg
 *   pieces / pcs / nos       → ALWAYS 1 (no scaling)
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ── Inline Models ─────────────────────────────────────────────────────────────
const inventorySchema = new mongoose.Schema({
  name:         { type: String, required: true },
  category:     { type: String },
  currentStock: { type: Number, default: 0 },
  unit:         { type: String, default: '' },
  branchId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  sizes: [{
    size:  { type: String, required: true },
    price: { type: Number, required: true },
    ingredients: [{
      inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
      quantity:        { type: Number, required: true },
      unit:            { type: String, default: '' },
    }],
  }],
  isAvailable: { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
const Product   = mongoose.models.Product   || mongoose.model('Product',   productSchema);

// ═══════════════════════════════════════════════════════════════════════════════
//
//  CATEGORY_ASSIGNMENTS
//  ─────────────────────────────────────────────────────────────────────────────
//  Key         = exact category name jaise DB mein hai
//  inventoryName = seedInventory.js ka exact item name
//  smallQty    = SMALL size ki base quantity (60g = 0.06kg)
//  unit        = kg / ml / pieces
//
//  ⚠️  pieces wali items HAMESHA 1 rahegi (koi scaling nahi)
//  ⚠️  kg/ml wali items small se auto-scale hongi
//
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_ASSIGNMENTS = {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHAWARMAS  (12 products — single "regular" size each)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Shawarmas': [
    { inventoryName: 'Shawarma Roti',          smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Chicken Breast',          smallQty: 0.06,  unit: 'kg'     },  // 60g
    { inventoryName: 'Shawarma Masala',         smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Mayonnaise',              smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Tomato',                  smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Cucumber',                smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Onion',                   smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Cabbage',                 smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Shawarma Wrap Paper',     smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHAWARMA PLATTERS  (5 products)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Shawarma Platters': [
    { inventoryName: 'Shawarma Roti',          smallQty: 2,     unit: 'pieces' },
    { inventoryName: 'Chicken Breast',          smallQty: 0.13,  unit: 'kg'     },
    { inventoryName: 'Shawarma Masala',         smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Mayonnaise',              smallQty: 0.04,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'French Fries (Frozen)',   smallQty: 0.10,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Tomato',                  smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Onion',                   smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Shawarma Wrap Paper',     smallQty: 2,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PARATHAS  (11 products — single "regular" size each)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Parathas': [
    { inventoryName: 'Paratha (Frozen)',        smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Chicken Breast',          smallQty: 0.06,  unit: 'kg'     },  // 60g
    { inventoryName: 'All-Purpose Flour',       smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Paratha Wrap Paper',      smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PARATHA PLATTERS  (3 products)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Paratha Platters': [
    { inventoryName: 'Paratha (Frozen)',        smallQty: 2,     unit: 'pieces' },
    { inventoryName: 'Chicken Breast',          smallQty: 0.12,  unit: 'kg'     },
    { inventoryName: 'All-Purpose Flour',       smallQty: 0.10,  unit: 'kg'     },
    { inventoryName: 'Egg',                     smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Cooking Oil',             smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.02,  unit: 'kg'     },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BURGERS  (12 products — single "regular" size each)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Burgers': [
    { inventoryName: 'Burger Bun',              smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Zinger Patty',            smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Cheddar Cheese Slice',    smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Mayonnaise',              smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Tomato',                  smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Cucumber',                smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Onion',                   smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Lettuce',                 smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Burger Wrap Paper',       smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Burger Box',              smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHICKEN FRIED  (1 product — small & large sizes)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Chicken Fried': [
    { inventoryName: 'Whole Chicken (Fried)',   smallQty: 0.12,  unit: 'kg'     },  // 120g small
    { inventoryName: 'Bread Crumbs',            smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Tikka Masala',            smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Red Chili Powder',        smallQty: 0.005, unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.08,  unit: 'kg'     },
    { inventoryName: 'Dip Sauce Cup (Small)',   smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Tissue Paper (Pack)',     smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HOT WINGS  (2 products — "5 piece" & "10 piece" sizes)
  // packaging: Wings Box (5 pc) / Wings Box (10 pc) — auto override neeche
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Hot Wings': [
    { inventoryName: 'Chicken Wings',           smallQty: 0.15,  unit: 'kg'     },  // 5 piece ≈ 150g
    { inventoryName: 'Red Chili Powder',        smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Peri Peri Sauce',         smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Tikka Masala',            smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.08,  unit: 'kg'     },
    { inventoryName: 'Dip Sauce Cup (Small)',   smallQty: 1,     unit: 'pieces' },
    // Wings box: auto override size se (5pc / 10pc)
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // OVEN BAKED WINGS  (1 product — "5 piece" & "10 piece" sizes)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Oven Baked Wings': [
    { inventoryName: 'Chicken Wings',           smallQty: 0.15,  unit: 'kg'     },
    { inventoryName: 'BBQ Sauce',               smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Tikka Masala',            smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Dip Sauce Cup (Small)',   smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NUGGETS  (1 product — "5 piece" & "10 piece" sizes)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Nuggets': [
    { inventoryName: 'Chicken Nuggets (Raw)',   smallQty: 0.12,  unit: 'kg'     },
    { inventoryName: 'Bread Crumbs',            smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Nuggets Box',             smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SOUP  (1 product — single "regular" size)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Soup': [
    { inventoryName: 'Chicken Soup Mix',        smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Macaroni',                smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Cooking Cream',           smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Onion',                   smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Soup Cup with Lid',       smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PIZZA  (8 products — small/medium/large/xl sizes)
  // Dough: size ke hisaab se auto override (PIZZA_DOUGH_OVERRIDE neeche)
  // Box:   size ke hisaab se auto override  (PIZZA_BOX_OVERRIDE neeche)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Pizza': [
    // Dough: placeholder — PIZZA_DOUGH_OVERRIDE se replace hoga
    { inventoryName: 'Pizza Dough Ball (Sm)',   smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Pizza Sauce',             smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Mozzarella Cheese',       smallQty: 0.06,  unit: 'kg'     },  // 60g
    { inventoryName: 'Chicken Tikka Marinated', smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Olive (Black)',           smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Capsicum (Green)',        smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Mushroom',               smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Sweet Corn',             smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',            smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Oregano',                smallQty: 0.005, unit: 'kg'     },
    // Box: placeholder — PIZZA_BOX_OVERRIDE se replace hoga
    { inventoryName: 'Pizza Box Small',        smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AMPF SPECIAL PIZZA  (10 products — small/medium/large/xl)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'AMPF Special Pizza': [
    // Dough: PIZZA_DOUGH_OVERRIDE se replace hoga
    { inventoryName: 'Pizza Dough Ball (Sm)',   smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Pizza Sauce',             smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Mozzarella Cheese',       smallQty: 0.08,  unit: 'kg'     },  // zyada cheese
    { inventoryName: 'Chicken Tikka Marinated', smallQty: 0.07,  unit: 'kg'     },
    { inventoryName: 'Seekh Kabab',             smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Cooking Cream',           smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Olive (Black)',           smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Capsicum (Green)',        smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Capsicum (Red)',          smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Mushroom',               smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',            smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Oregano',                smallQty: 0.005, unit: 'kg'     },
    // Box: PIZZA_BOX_OVERRIDE se replace hoga
    { inventoryName: 'Pizza Box Small',        smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WRAPS  (5 products — single "regular" size each)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Wraps': [
    { inventoryName: 'Wrap Tortilla',           smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Chicken Grill Marinated', smallQty: 0.06,  unit: 'kg'     },  // 60g
    { inventoryName: 'Garlic Sauce',            smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Mayonnaise',              smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Tomato',                  smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Cucumber',                smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Cabbage',                 smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Lettuce',                 smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Wrap Box / Clamshell',    smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SANDWICHES  (6 products — single "regular" size each)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Sandwiches': [
    { inventoryName: 'Sandwich Bread (Loaf)',   smallQty: 2,     unit: 'pieces' },
    { inventoryName: 'Chicken Grill Marinated', smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Cheddar Cheese Slice',    smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Mayonnaise',              smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Mustard Sauce',           smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Tomato',                  smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Cucumber',                smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Onion',                   smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Lettuce',                 smallQty: 0.01,  unit: 'kg'     },
    { inventoryName: 'Sandwich Box',            smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FRIES  (3 products — small/medium/large sizes)
  // Box: size se auto override (FRIES_BOX_OVERRIDE neeche)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Fries': [
    { inventoryName: 'French Fries (Frozen)',   smallQty: 0.10,  unit: 'kg'     },  // 100g small
    { inventoryName: 'Cooking Oil',             smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Salt',                    smallQty: 0.005, unit: 'kg'     },
    { inventoryName: 'Chaat Masala',            smallQty: 0.005, unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.02,  unit: 'kg'     },
    // Fries box: FRIES_BOX_OVERRIDE se replace hoga
    { inventoryName: 'Fries Box Small',         smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PASTA  (4 products — half/full sizes)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Pasta': [
    { inventoryName: 'Macaroni',                smallQty: 0.10,  unit: 'kg'     },  // half size
    { inventoryName: 'Pizza Sauce',             smallQty: 0.04,  unit: 'kg'     },
    { inventoryName: 'Chicken Breast',          smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Mozzarella Cheese',       smallQty: 0.04,  unit: 'kg'     },
    { inventoryName: 'Cooking Cream',           smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Mushroom',               smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Capsicum (Green)',        smallQty: 0.015, unit: 'kg'     },
    { inventoryName: 'Cooking Oil',            smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Mixed Herbs',            smallQty: 0.005, unit: 'kg'     },
    { inventoryName: 'Pasta Box / Container',  smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Plastic Fork',           smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DESSERTS  (4 products — single "regular" or "per scope" size)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Desserts': [
    { inventoryName: 'Brownie Mix',             smallQty: 0.08,  unit: 'kg'     },
    { inventoryName: 'Ice Cream (Vanilla Tub)', smallQty: 0.05,  unit: 'kg'     },
    { inventoryName: 'Chocolate Sauce',         smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Sugar',                   smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Cooking Cream',           smallQty: 0.03,  unit: 'kg'     },
    { inventoryName: 'Dessert Box',             smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Plastic Spoon',           smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EXTRAS  (7 products — add-on / topping items)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Extras': [
    { inventoryName: 'Dip Sauce Cup (Small)',   smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Carry Bag (Medium)',      smallQty: 1,     unit: 'pieces' },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SPECIAL ITEMS  (3 products — Chicken Cheese Stick, Spin Roll, Chicken Doner)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Special Items': [
    { inventoryName: 'Chicken Breast',          smallQty: 0.10,  unit: 'kg'     },
    { inventoryName: 'Mozzarella Cheese',       smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Bread Crumbs',            smallQty: 0.04,  unit: 'kg'     },
    { inventoryName: 'Cooking Oil',             smallQty: 0.06,  unit: 'kg'     },
    { inventoryName: 'Garlic Sauce',            smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Ketchup',                 smallQty: 0.02,  unit: 'kg'     },
    { inventoryName: 'Shawarma Roti',           smallQty: 1,     unit: 'pieces' },
    { inventoryName: 'Wrap Box / Clamshell',    smallQty: 1,     unit: 'pieces' },
  ],

};

// ═══════════════════════════════════════════════════════════════════════════════
//
//  SIZE AUTO-SCALING
//  small = base (smallQty as defined)
//  60g = 0.06kg base for most items
//
//  SIZE_OFFSETS_G: offset in grams from small base
//    small / half / per scope = 0   (base)
//    regular / full / medium  = +20g
//    large                    = +40g
//    xl / extra               = +60g
//
// ═══════════════════════════════════════════════════════════════════════════════

const SIZE_OFFSETS_G = {
  small:     0,
  half:      0,
  'per scope': 0,
  medium:    20,
  regular:   20,
  full:      20,
  standard:  20,
  large:     40,
  extra:     60,
  xl:        60,
};

function calcQty(smallQty, sizeKey, unit) {
  const u        = (unit || '').toLowerCase();
  const isPiece  = ['pieces', 'piece', 'pcs', 'nos'].includes(u);
  const isKg     = ['kg', 'half_kg', 'quarter_kg'].includes(u);

  if (isPiece) return 1;   // HAMESHA 1 — koi scaling nahi

  const offsetG = SIZE_OFFSETS_G[sizeKey] ?? 0;

  if (isKg) return +Math.max(0, smallQty + offsetG / 1000).toFixed(4);
  return Math.max(0, smallQty + offsetG);   // g / ml
}

// ── Pizza: size → dough item name ─────────────────────────────────────────────
const PIZZA_DOUGH_NAMES_DB = [
  'Pizza Dough Ball (Sm)', 'Pizza Dough Ball (Med)',
  'Pizza Dough Ball (Lg)', 'Pizza Dough Ball (XL)',
];
const PIZZA_DOUGH_OVERRIDE = {
  small:  { name: 'Pizza Dough Ball (Sm)', qty: 1 },
  medium: { name: 'Pizza Dough Ball (Med)', qty: 1 },
  large:  { name: 'Pizza Dough Ball (Lg)', qty: 1 },
  xl:     { name: 'Pizza Dough Ball (XL)', qty: 1 },
  extra:  { name: 'Pizza Dough Ball (XL)', qty: 1 },
};

// ── Pizza: size → box name ────────────────────────────────────────────────────
const PIZZA_BOX_NAMES_DB = [
  'Pizza Box Small', 'Pizza Box Medium', 'Pizza Box Large', 'Pizza Box XL',
];
const PIZZA_BOX_OVERRIDE = {
  small:  'Pizza Box Small',
  medium: 'Pizza Box Medium',
  large:  'Pizza Box Large',
  xl:     'Pizza Box XL',
  extra:  'Pizza Box XL',
};

// ── Fries: size → box name ────────────────────────────────────────────────────
const FRIES_BOX_NAMES_DB = ['Fries Box Small', 'Fries Box Medium', 'Fries Box Large'];
const FRIES_BOX_OVERRIDE = {
  small:  'Fries Box Small',
  medium: 'Fries Box Medium',
  large:  'Fries Box Large',
};

// ── Wings: size → box name ────────────────────────────────────────────────────
const WINGS_BOX_NAMES_DB = ['Wings Box (5 pc)', 'Wings Box (10 pc)'];
const WINGS_BOX_OVERRIDE = (sizeKey) => {
  if (sizeKey.includes('10')) return 'Wings Box (10 pc)';
  return 'Wings Box (5 pc)';  // default 5pc
};
const WINGS_CATEGORIES = ['Hot Wings', 'Oven Baked Wings'];

// ── Wings: quantity scaling for piece-based sizes ─────────────────────────────
// "5 piece" → chicken 0.15kg,  "10 piece" → 0.30kg
const WINGS_CHICKEN_QTY = (sizeKey, baseQty) => {
  if (sizeKey.includes('10')) return +(baseQty * 2).toFixed(4);
  return baseQty;
};

// ── Pretty table printer ──────────────────────────────────────────────────────
function printTable(headers, rows) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length))
  );
  const line = widths.map(w => '─'.repeat(w + 2)).join('┼');
  const fmt  = row => widths.map((w, i) => ` ${String(row[i] ?? '').padEnd(w)} `).join('│');
  console.log('┌' + widths.map(w => '─'.repeat(w + 2)).join('┬') + '┐');
  console.log('│' + fmt(headers) + '│');
  console.log('├' + line + '┤');
  rows.forEach(r => console.log('│' + fmt(r) + '│'));
  console.log('└' + widths.map(w => '─'.repeat(w + 2)).join('┴') + '┘');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) { console.error('❌  MONGODB_URI .env mein set karo'); process.exit(1); }

  const FORCE   = process.argv.includes('--force');
  const DRY_RUN = process.argv.includes('--dry-run');
  const LIST    = process.argv.includes('--list');

  await mongoose.connect(MONGODB_URI);
  console.log('✅  MongoDB connected\n');

  const [allInventory, allCategories] = await Promise.all([
    Inventory.find({ isActive: true }).sort({ name: 1 }).lean(),
    Product.distinct('category'),
  ]);
  allCategories.sort();

  const inventoryMap = {};
  allInventory.forEach(i => { inventoryMap[i.name] = i; });

  // ── --list mode ────────────────────────────────────────────────────────────
  if (LIST) {
    console.log('═'.repeat(64));
    console.log('📋  DB MEIN PRODUCT CATEGORIES');
    console.log('═'.repeat(64));
    const catRows = [];
    for (const cat of allCategories) {
      const count    = await Product.countDocuments({ category: cat });
      const assigned = cat in CATEGORY_ASSIGNMENTS ? '✅ assigned' : '⬜ not yet';
      catRows.push([cat, count, assigned]);
    }
    printTable(['Category', 'Products', 'Status'], catRows);

    console.log('\n' + '═'.repeat(64));
    console.log('📦  INVENTORY ITEMS (active)');
    console.log('═'.repeat(64));
    printTable(
      ['#', 'Name', 'Category', 'Unit', 'Stock'],
      allInventory.map((i, idx) => [idx + 1, i.name, i.category || '—', i.unit || '—', i.currentStock])
    );
    console.log('\n💡  TIP: Naam copy karo → CATEGORY_ASSIGNMENTS mein update karo\n');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`📦  Inventory items  : ${allInventory.length}`);
  console.log(`📂  Categories in DB : ${allCategories.length}  →  ${allCategories.join(', ')}`);
  console.log(`🗂️   Assigned         : ${Object.keys(CATEGORY_ASSIGNMENTS).length}`);
  console.log(`🚀  Mode             : ${DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE' : 'SAFE'}`);
  console.log('='.repeat(64));

  const unassigned = allCategories.filter(c => !(c in CATEGORY_ASSIGNMENTS));
  if (unassigned.length) {
    console.log(`\n⚠️   Unassigned (skipped): ${unassigned.join(', ')}\n`);
  }

  let totalProducts = 0, skippedProducts = 0, sizesUpdated = 0, sizesSkipped = 0;
  const warnings = [];

  // ── Process each category ─────────────────────────────────────────────────
  for (const [category, template] of Object.entries(CATEGORY_ASSIGNMENTS)) {

    if (!allCategories.includes(category)) {
      const msg = `Category "${category}" DB mein nahi mili — skip`;
      console.log(`\n❌  ${msg}`);
      warnings.push(msg);
      continue;
    }

    const products = await Product.find({ category }).lean();
    console.log(`\n📂  ${category}  (${products.length} products)`);

    // ── Resolve inventory names → ObjectIds ──────────────────────────────
    const resolvedTemplate = [];
    for (const t of template) {
      const inv = inventoryMap[t.inventoryName];
      if (!inv) {
        const msg = `[${category}] "${t.inventoryName}" inventory mein nahi mila — skip`;
        console.log(`   ⚠️  ${msg}`);
        warnings.push(msg);
        continue;
      }
      resolvedTemplate.push({ ...t, inventoryId: inv._id });
    }

    if (!resolvedTemplate.length) {
      console.log(`   ❌  Koi valid ingredient nahi — category skip`);
      continue;
    }

    // Print preview (small base)
    const previewRows = resolvedTemplate.map(t => {
      const sQty = t.unit === 'pieces' ? 1 : calcQty(t.smallQty, 'small',  t.unit);
      const mQty = t.unit === 'pieces' ? 1 : calcQty(t.smallQty, 'medium', t.unit);
      const lQty = t.unit === 'pieces' ? 1 : calcQty(t.smallQty, 'large',  t.unit);
      return [t.inventoryName, t.unit, String(sQty), String(mQty), String(lQty)];
    });
    printTable(['Ingredient', 'Unit', 'Small', 'Medium', 'Large'], previewRows);

    // ── Per product ───────────────────────────────────────────────────────
    for (const product of products) {
      totalProducts++;
      const doc = await Product.findById(product._id);

      const filledSizes = doc.sizes.filter(s => s.ingredients?.length > 0);
      const emptySizes  = doc.sizes.filter(s => !s.ingredients?.length);

      if (!FORCE && filledSizes.length > 0 && !emptySizes.length) {
        skippedProducts++;
        sizesSkipped += doc.sizes.length;
        console.log(`   ⏭️  "${doc.name}" — sab sizes filled → skip`);
        continue;
      }
      if (!FORCE && filledSizes.length > 0) {
        console.log(`   ⚡  "${doc.name}" — partial fill (${filledSizes.length} done, ${emptySizes.length} empty)`);
      }

      let modified = false;

      for (const sizeObj of doc.sizes) {
        if (!FORCE && sizeObj.ingredients?.length > 0) {
          sizesSkipped++;
          continue;
        }

        const sizeKey = sizeObj.size.toLowerCase().trim();

        // ── Build size-specific template ──────────────────────────────────
        let sizeTemplate = [...resolvedTemplate];

        // Pizza: dough override
        if (['Pizza', 'AMPF Special Pizza'].includes(category)) {
          const doughOverride = PIZZA_DOUGH_OVERRIDE[sizeKey];
          const boxOverride   = PIZZA_BOX_OVERRIDE[sizeKey];

          if (doughOverride) {
            const doughInv = inventoryMap[doughOverride.name];
            if (doughInv) {
              sizeTemplate = sizeTemplate
                .filter(t => !PIZZA_DOUGH_NAMES_DB.includes(t.inventoryName))
                .concat({ inventoryName: doughOverride.name, inventoryId: doughInv._id, smallQty: 1, unit: 'pieces' });
            }
          }
          if (boxOverride) {
            const boxInv = inventoryMap[boxOverride];
            if (boxInv) {
              sizeTemplate = sizeTemplate
                .filter(t => !PIZZA_BOX_NAMES_DB.includes(t.inventoryName))
                .concat({ inventoryName: boxOverride, inventoryId: boxInv._id, smallQty: 1, unit: 'pieces' });
            }
          }
        }

        // Fries: box override
        if (category === 'Fries') {
          const boxName = FRIES_BOX_OVERRIDE[sizeKey];
          if (boxName) {
            const boxInv = inventoryMap[boxName];
            if (boxInv) {
              sizeTemplate = sizeTemplate
                .filter(t => !FRIES_BOX_NAMES_DB.includes(t.inventoryName))
                .concat({ inventoryName: boxName, inventoryId: boxInv._id, smallQty: 1, unit: 'pieces' });
            }
          }
        }

        // Wings: box override + chicken qty double for 10pc
        if (WINGS_CATEGORIES.includes(category)) {
          const boxName = WINGS_BOX_OVERRIDE(sizeKey);
          const boxInv  = inventoryMap[boxName];
          if (boxInv) {
            sizeTemplate = sizeTemplate
              .filter(t => !WINGS_BOX_NAMES_DB.includes(t.inventoryName))
              .concat({ inventoryName: boxName, inventoryId: boxInv._id, smallQty: 1, unit: 'pieces' });
          }
          // Chicken qty double karo 10 piece ke liye
          sizeTemplate = sizeTemplate.map(t =>
            t.inventoryName === 'Chicken Wings'
              ? { ...t, smallQty: WINGS_CHICKEN_QTY(sizeKey, t.smallQty) }
              : t
          );
        }

        // ── Final ingredients ─────────────────────────────────────────────
        const ingredients = sizeTemplate.map(t => {
          const qty = t.unit === 'pieces' ? 1 : calcQty(t.smallQty, sizeKey, t.unit);
          return { inventoryItemId: t.inventoryId, quantity: qty, unit: t.unit };
        });

        if (DRY_RUN) {
          console.log(`   [DRY] "${doc.name}" [${sizeObj.size}]:`);
          sizeTemplate.forEach(t => {
            const qty = t.unit === 'pieces' ? 1 : calcQty(t.smallQty, sizeKey, t.unit);
            console.log(`         • ${t.inventoryName.padEnd(26)}: ${String(qty).padStart(8)} ${t.unit}`);
          });
        } else {
          sizeObj.ingredients = ingredients;
          modified = true;
          sizesUpdated++;
          console.log(`   ✅  "${doc.name}"  [${sizeObj.size}]  — ${ingredients.length} ingredients`);
        }
      }

      if (modified) await doc.save();
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(64));
  console.log('📊  SUMMARY');
  console.log('='.repeat(64));
  console.log(`   Products total   : ${totalProducts}`);
  console.log(`   Products skipped : ${skippedProducts}`);
  console.log(`   Sizes updated    : ${sizesUpdated}`);
  console.log(`   Sizes skipped    : ${sizesSkipped}`);
  if (warnings.length) {
    console.log(`\n⚠️   WARNINGS (${warnings.length}):`);
    warnings.forEach(w => console.log(`   • ${w}`));
  }
  if (DRY_RUN) {
    console.log('\n💡  Dry run — kuch save nahi hua.\n');
  } else {
    console.log('\n🎉  Done!\n');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌  ERROR:', err.message);
  process.exit(1);
});