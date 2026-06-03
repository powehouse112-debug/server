require('dotenv').config();
const mongoose = require('mongoose');

// ── Inventory Schema (inline) ─────────────────────────────────────────────────
const inventorySchema = new mongoose.Schema({
  name:          { type: String, required: true },
  category:      { type: String, required: true },
  unit:          {
    type: String,
    enum: ['g','gram','grams','kg','half_kg','quarter_kg',
           'ml','milliliter','liter','half_liter',
           'pieces','piece','pcs','nos',''],
    default: 'kg',
  },
  currentStock:  { type: Number, default: 0 },
  minimumStock:  { type: Number, default: 0 },   // reorder alert level
  costPerUnit:   { type: Number, default: 0 },   // PKR per unit
  isActive:      { type: Boolean, default: true },
  branchId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
}, { timestamps: true });

const branchSchema = new mongoose.Schema({
  name: String, address: String, city: String,
  phone: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: String, role: String,
}, { timestamps: true });

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
const Branch    = mongoose.models.Branch    || mongoose.model('Branch',    branchSchema);
const User      = mongoose.models.User      || mongoose.model('User',      userSchema);

// ── Config ────────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌  MONGODB_URI .env mein set karo'); process.exit(1); }

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY DATA
// Fields: name, category, unit, currentStock, minimumStock, costPerUnit
// costPerUnit = PKR (approximate market rate — apni marzi se update karo)
// ─────────────────────────────────────────────────────────────────────────────
const INVENTORY_ITEMS = [

  // ══════════════════════════════════════════════════════════════
  // RAW CHICKEN
  // ══════════════════════════════════════════════════════════════
  { category: 'Raw Chicken', name: 'Chicken Breast',            unit: 'kg',     currentStock: 10,  minimumStock: 3,   costPerUnit: 700  },
  { category: 'Raw Chicken', name: 'Chicken Mince',             unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 650  },
  { category: 'Raw Chicken', name: 'Chicken Wings',             unit: 'kg',     currentStock: 8,   minimumStock: 3,   costPerUnit: 650  },
  { category: 'Raw Chicken', name: 'Whole Chicken (Fried)',     unit: 'kg',     currentStock: 6,   minimumStock: 2,   costPerUnit: 620  },
  { category: 'Raw Chicken', name: 'Chicken Tikka Marinated',   unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 750  },
  { category: 'Raw Chicken', name: 'Chicken Fajita Strips',     unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 720  },
  { category: 'Raw Chicken', name: 'Chicken Malai Botti',       unit: 'kg',     currentStock: 4,   minimumStock: 1,   costPerUnit: 780  },
  { category: 'Raw Chicken', name: 'Chicken Behari Botti',      unit: 'kg',     currentStock: 4,   minimumStock: 1,   costPerUnit: 760  },
  { category: 'Raw Chicken', name: 'Chicken Grill Marinated',   unit: 'kg',     currentStock: 4,   minimumStock: 1,   costPerUnit: 730  },
  { category: 'Raw Chicken', name: 'Chicken Nuggets (Raw)',     unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 800  },

  // ══════════════════════════════════════════════════════════════
  // KABABS & PROCESSED
  // ══════════════════════════════════════════════════════════════
  { category: 'Kababs & Processed', name: 'Seekh Kabab',        unit: 'pieces', currentStock: 50,  minimumStock: 20,  costPerUnit: 60   },
  { category: 'Kababs & Processed', name: 'Shami Kabab',        unit: 'pieces', currentStock: 40,  minimumStock: 15,  costPerUnit: 50   },
  { category: 'Kababs & Processed', name: 'Zinger Patty',       unit: 'pieces', currentStock: 40,  minimumStock: 15,  costPerUnit: 120  },
  { category: 'Kababs & Processed', name: 'Chicken Patty',      unit: 'pieces', currentStock: 30,  minimumStock: 10,  costPerUnit: 90   },
  { category: 'Kababs & Processed', name: 'Petty Patty',        unit: 'pieces', currentStock: 30,  minimumStock: 10,  costPerUnit: 80   },

  // ══════════════════════════════════════════════════════════════
  // DAIRY
  // ══════════════════════════════════════════════════════════════
  { category: 'Dairy',  name: 'Mozzarella Cheese',        unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 1800 },
  { category: 'Dairy',  name: 'Cheddar Cheese Slice',     unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 25   },
  { category: 'Dairy',  name: 'Cream Cheese',             unit: 'kg',     currentStock: 2,   minimumStock: 1,   costPerUnit: 1600 },
  { category: 'Dairy',  name: 'Cooking Cream',            unit: 'liter',  currentStock: 4,   minimumStock: 1,   costPerUnit: 400  },
  { category: 'Dairy',  name: 'Butter',                   unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 1200 },
  { category: 'Dairy',  name: 'Milk',                     unit: 'liter',  currentStock: 5,   minimumStock: 2,   costPerUnit: 160  },
  { category: 'Dairy',  name: 'Mayonnaise',               unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 600  },
  { category: 'Dairy',  name: 'Egg',                      unit: 'pieces', currentStock: 60,  minimumStock: 24,  costPerUnit: 20   },

  // ══════════════════════════════════════════════════════════════
  // BREAD & DOUGH
  // ══════════════════════════════════════════════════════════════
  { category: 'Bread & Dough', name: 'Shawarma Roti',          unit: 'pieces', currentStock: 100, minimumStock: 40,  costPerUnit: 20   },
  { category: 'Bread & Dough', name: 'Burger Bun',             unit: 'pieces', currentStock: 80,  minimumStock: 30,  costPerUnit: 25   },
  { category: 'Bread & Dough', name: 'Paratha (Frozen)',        unit: 'pieces', currentStock: 60,  minimumStock: 20,  costPerUnit: 30   },
  { category: 'Bread & Dough', name: 'Pizza Dough Ball (Sm)',  unit: 'pieces', currentStock: 20,  minimumStock: 5,   costPerUnit: 50   },
  { category: 'Bread & Dough', name: 'Pizza Dough Ball (Med)', unit: 'pieces', currentStock: 20,  minimumStock: 5,   costPerUnit: 80   },
  { category: 'Bread & Dough', name: 'Pizza Dough Ball (Lg)',  unit: 'pieces', currentStock: 15,  minimumStock: 5,   costPerUnit: 120  },
  { category: 'Bread & Dough', name: 'Pizza Dough Ball (XL)',  unit: 'pieces', currentStock: 10,  minimumStock: 3,   costPerUnit: 180  },
  { category: 'Bread & Dough', name: 'Sandwich Bread (Loaf)',  unit: 'pieces', currentStock: 10,  minimumStock: 3,   costPerUnit: 80   },
  { category: 'Bread & Dough', name: 'Wrap Tortilla',          unit: 'pieces', currentStock: 60,  minimumStock: 20,  costPerUnit: 30   },
  { category: 'Bread & Dough', name: 'Lasagna Sheets',         unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 400  },
  { category: 'Bread & Dough', name: 'All-Purpose Flour',      unit: 'kg',     currentStock: 10,  minimumStock: 3,   costPerUnit: 120  },
  { category: 'Bread & Dough', name: 'Bread Crumbs',           unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 300  },

  // ══════════════════════════════════════════════════════════════
  // SAUCES & CONDIMENTS
  // ══════════════════════════════════════════════════════════════
  { category: 'Sauces',  name: 'Pizza Sauce',              unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 400  },
  { category: 'Sauces',  name: 'Garlic Sauce',             unit: 'kg',     currentStock: 4,   minimumStock: 1,   costPerUnit: 350  },
  { category: 'Sauces',  name: 'Chili Garlic Sauce',       unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 350  },
  { category: 'Sauces',  name: 'BBQ Sauce',                unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 450  },
  { category: 'Sauces',  name: 'Ketchup',                  unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 280  },
  { category: 'Sauces',  name: 'White Sauce (Bechamel)',   unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 400  },
  { category: 'Sauces',  name: 'Achari Sauce',             unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 380  },
  { category: 'Sauces',  name: 'Peri Peri Sauce',          unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 420  },
  { category: 'Sauces',  name: 'Mustard Sauce',            unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 350  },
  { category: 'Sauces',  name: 'Shawarma Special Sauce',   unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 380  },
  { category: 'Sauces',  name: 'Chocolate Sauce',          unit: 'kg',     currentStock: 1,   minimumStock: 0.5, costPerUnit: 500  },

  // ══════════════════════════════════════════════════════════════
  // VEGETABLES
  // ══════════════════════════════════════════════════════════════
  { category: 'Vegetables', name: 'Lettuce',               unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 150  },
  { category: 'Vegetables', name: 'Tomato',                unit: 'kg',     currentStock: 4,   minimumStock: 1,   costPerUnit: 80   },
  { category: 'Vegetables', name: 'Onion',                 unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 60   },
  { category: 'Vegetables', name: 'Capsicum (Green)',      unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 120  },
  { category: 'Vegetables', name: 'Capsicum (Red)',        unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 140  },
  { category: 'Vegetables', name: 'Mushroom',              unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 400  },
  { category: 'Vegetables', name: 'Olive (Black)',         unit: 'kg',     currentStock: 1,   minimumStock: 0.3, costPerUnit: 800  },
  { category: 'Vegetables', name: 'Olive (Green)',         unit: 'kg',     currentStock: 1,   minimumStock: 0.3, costPerUnit: 800  },
  { category: 'Vegetables', name: 'Cucumber',              unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 80   },
  { category: 'Vegetables', name: 'Jalapeno',              unit: 'kg',     currentStock: 1,   minimumStock: 0.3, costPerUnit: 300  },
  { category: 'Vegetables', name: 'Sweet Corn',            unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 200  },
  { category: 'Vegetables', name: 'Cabbage',               unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 50   },

  // ══════════════════════════════════════════════════════════════
  // SPICES & SEASONINGS
  // ══════════════════════════════════════════════════════════════
  { category: 'Spices', name: 'Salt',                      unit: 'kg',     currentStock: 5,   minimumStock: 1,   costPerUnit: 80   },
  { category: 'Spices', name: 'Black Pepper',              unit: 'kg',     currentStock: 1,   minimumStock: 0.2, costPerUnit: 900  },
  { category: 'Spices', name: 'Red Chili Powder',          unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 500  },
  { category: 'Spices', name: 'Tikka Masala',              unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 600  },
  { category: 'Spices', name: 'Garam Masala',              unit: 'kg',     currentStock: 1,   minimumStock: 0.3, costPerUnit: 700  },
  { category: 'Spices', name: 'Cumin (Zeera)',             unit: 'kg',     currentStock: 1,   minimumStock: 0.2, costPerUnit: 600  },
  { category: 'Spices', name: 'Coriander Powder',          unit: 'kg',     currentStock: 1,   minimumStock: 0.2, costPerUnit: 500  },
  { category: 'Spices', name: 'Turmeric (Haldi)',          unit: 'kg',     currentStock: 1,   minimumStock: 0.2, costPerUnit: 400  },
  { category: 'Spices', name: 'Chaat Masala',              unit: 'kg',     currentStock: 1,   minimumStock: 0.2, costPerUnit: 600  },
  { category: 'Spices', name: 'Oregano',                   unit: 'kg',     currentStock: 0.5, minimumStock: 0.1, costPerUnit: 1200 },
  { category: 'Spices', name: 'Mixed Herbs',               unit: 'kg',     currentStock: 0.5, minimumStock: 0.1, costPerUnit: 1000 },
  { category: 'Spices', name: 'Shawarma Masala',           unit: 'kg',     currentStock: 1,   minimumStock: 0.3, costPerUnit: 700  },
  { category: 'Spices', name: 'Lemon (Fresh)',             unit: 'pieces', currentStock: 30,  minimumStock: 10,  costPerUnit: 10   },

  // ══════════════════════════════════════════════════════════════
  // OILS & FATS
  // ══════════════════════════════════════════════════════════════
  { category: 'Oils',   name: 'Cooking Oil',               unit: 'liter',  currentStock: 20,  minimumStock: 5,   costPerUnit: 380  },
  { category: 'Oils',   name: 'Olive Oil',                 unit: 'liter',  currentStock: 2,   minimumStock: 0.5, costPerUnit: 1200 },

  // ══════════════════════════════════════════════════════════════
  // PASTA & DRY GOODS
  // ══════════════════════════════════════════════════════════════
  { category: 'Dry Goods', name: 'Macaroni',               unit: 'kg',     currentStock: 5,   minimumStock: 2,   costPerUnit: 200  },
  { category: 'Dry Goods', name: 'Penne Pasta',            unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 220  },
  { category: 'Dry Goods', name: 'French Fries (Frozen)',  unit: 'kg',     currentStock: 15,  minimumStock: 5,   costPerUnit: 350  },
  { category: 'Dry Goods', name: 'Sugar',                  unit: 'kg',     currentStock: 5,   minimumStock: 1,   costPerUnit: 130  },
  { category: 'Dry Goods', name: 'Brownie Mix',            unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 600  },
  { category: 'Dry Goods', name: 'Ice Cream (Vanilla Tub)',unit: 'kg',     currentStock: 3,   minimumStock: 1,   costPerUnit: 700  },
  { category: 'Dry Goods', name: 'Russian Salad Mix',      unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 300  },
  { category: 'Dry Goods', name: 'Chicken Soup Mix',       unit: 'kg',     currentStock: 2,   minimumStock: 0.5, costPerUnit: 400  },

  // ══════════════════════════════════════════════════════════════
  // DRINKS RAW (for self-prepared drinks / in-store)
  // ══════════════════════════════════════════════════════════════
  { category: 'Drinks',  name: 'Cold Drink Bottle 1.5L',   unit: 'pieces', currentStock: 30,  minimumStock: 10,  costPerUnit: 120  },
  { category: 'Drinks',  name: 'Cold Drink Bottle 1L',     unit: 'pieces', currentStock: 30,  minimumStock: 10,  costPerUnit: 90   },
  { category: 'Drinks',  name: 'Cold Drink Can 330ml',     unit: 'pieces', currentStock: 50,  minimumStock: 20,  costPerUnit: 80   },
  { category: 'Drinks',  name: 'Water Bottle 500ml',       unit: 'pieces', currentStock: 50,  minimumStock: 20,  costPerUnit: 30   },

  // ══════════════════════════════════════════════════════════════
  // PACKAGING — PIZZA
  // ══════════════════════════════════════════════════════════════
  { category: 'Packaging', name: 'Pizza Box Small',        unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 35   },
  { category: 'Packaging', name: 'Pizza Box Medium',       unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 50   },
  { category: 'Packaging', name: 'Pizza Box Large',        unit: 'pieces', currentStock: 80,  minimumStock: 25,  costPerUnit: 70   },
  { category: 'Packaging', name: 'Pizza Box XL',           unit: 'pieces', currentStock: 50,  minimumStock: 15,  costPerUnit: 100  },
  { category: 'Packaging', name: 'Pizza Divider Stand',    unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 5    },

  // ══════════════════════════════════════════════════════════════
  // PACKAGING — BURGERS / WRAPS
  // ══════════════════════════════════════════════════════════════
  { category: 'Packaging', name: 'Burger Box',             unit: 'pieces', currentStock: 150, minimumStock: 50,  costPerUnit: 20   },
  { category: 'Packaging', name: 'Burger Wrap Paper',      unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 5    },
  { category: 'Packaging', name: 'Shawarma Wrap Paper',    unit: 'pieces', currentStock: 200, minimumStock: 60,  costPerUnit: 5    },
  { category: 'Packaging', name: 'Paratha Wrap Paper',     unit: 'pieces', currentStock: 200, minimumStock: 60,  costPerUnit: 5    },
  { category: 'Packaging', name: 'Sandwich Box',           unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 20   },
  { category: 'Packaging', name: 'Wrap Box / Clamshell',   unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 18   },

  // ══════════════════════════════════════════════════════════════
  // PACKAGING — FRIES / SIDES
  // ══════════════════════════════════════════════════════════════
  { category: 'Packaging', name: 'Fries Box Small',        unit: 'pieces', currentStock: 150, minimumStock: 50,  costPerUnit: 10   },
  { category: 'Packaging', name: 'Fries Box Medium',       unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 15   },
  { category: 'Packaging', name: 'Fries Box Large',        unit: 'pieces', currentStock: 80,  minimumStock: 25,  costPerUnit: 20   },
  { category: 'Packaging', name: 'Wings Box (5 pc)',       unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 15   },
  { category: 'Packaging', name: 'Wings Box (10 pc)',      unit: 'pieces', currentStock: 80,  minimumStock: 25,  costPerUnit: 22   },
  { category: 'Packaging', name: 'Nuggets Box',            unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 15   },
  { category: 'Packaging', name: 'Pasta Box / Container',  unit: 'pieces', currentStock: 80,  minimumStock: 25,  costPerUnit: 25   },
  { category: 'Packaging', name: 'Soup Cup with Lid',      unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 20   },
  { category: 'Packaging', name: 'Dip Sauce Cup (Small)',  unit: 'pieces', currentStock: 200, minimumStock: 60,  costPerUnit: 5    },
  { category: 'Packaging', name: 'Ice Cream Cup',          unit: 'pieces', currentStock: 80,  minimumStock: 20,  costPerUnit: 10   },
  { category: 'Packaging', name: 'Dessert Box',            unit: 'pieces', currentStock: 60,  minimumStock: 15,  costPerUnit: 25   },

  // ══════════════════════════════════════════════════════════════
  // PACKAGING — GENERAL
  // ══════════════════════════════════════════════════════════════
  { category: 'Packaging', name: 'Carry Bag (Large)',       unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 15   },
  { category: 'Packaging', name: 'Carry Bag (Medium)',      unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 10   },
  { category: 'Packaging', name: 'Delivery Bag (Thermal)', unit: 'pieces', currentStock: 5,   minimumStock: 2,   costPerUnit: 1500 },
  { category: 'Packaging', name: 'Aluminum Foil Roll',     unit: 'pieces', currentStock: 10,  minimumStock: 3,   costPerUnit: 250  },
  { category: 'Packaging', name: 'Cling Wrap Roll',        unit: 'pieces', currentStock: 5,   minimumStock: 2,   costPerUnit: 200  },
  { category: 'Packaging', name: 'Food Label Sticker',     unit: 'pieces', currentStock: 500, minimumStock: 100, costPerUnit: 2    },
  { category: 'Packaging', name: 'Paper Plate',            unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 8    },
  { category: 'Packaging', name: 'Tissue Paper (Pack)',    unit: 'pieces', currentStock: 50,  minimumStock: 15,  costPerUnit: 80   },
  { category: 'Packaging', name: 'Napkin (Pack)',           unit: 'pieces', currentStock: 30,  minimumStock: 10,  costPerUnit: 60   },
  { category: 'Packaging', name: 'Plastic Straw',          unit: 'pieces', currentStock: 500, minimumStock: 100, costPerUnit: 2    },
  { category: 'Packaging', name: 'Plastic Spoon',          unit: 'pieces', currentStock: 300, minimumStock: 80,  costPerUnit: 3    },
  { category: 'Packaging', name: 'Plastic Fork',           unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 3    },
  { category: 'Packaging', name: 'Plastic Knife',          unit: 'pieces', currentStock: 100, minimumStock: 30,  costPerUnit: 3    },
  { category: 'Packaging', name: 'Wooden Ice Cream Stick', unit: 'pieces', currentStock: 200, minimumStock: 50,  costPerUnit: 2    },
  { category: 'Packaging', name: 'Toothpick',              unit: 'pieces', currentStock: 500, minimumStock: 100, costPerUnit: 0.5  },
];

// ── Main Seed ─────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  MongoDB connected\n');

  const branch = await mongoose.model('Branch').findOne({ isActive: true }).lean();
  if (!branch) { console.error('❌  Koi active branch nahi mili'); process.exit(1); }
  console.log(`🏢  Branch: ${branch.name} — ${branch.city} | ${branch._id}\n`);

  const user = await mongoose.model('User').findOne({}).lean();
  if (!user) { console.error('❌  Koi user nahi mila DB mein'); process.exit(1); }
  console.log(`👤  User: ${user.name || user.email} | ${user._id}\n`);

  const branchId  = branch._id;
  const createdBy = user._id;

  console.log('━━━ Seeding Inventory ━━━');
  let created = 0, updated = 0;

  for (const item of INVENTORY_ITEMS) {
    const existing = await Inventory.findOne({ name: item.name, branchId });
    if (existing) {
      await Inventory.updateOne({ _id: existing._id }, {
        $set: {
          category:     item.category,
          unit:         item.unit,
          minimumStock: item.minimumStock,
          costPerUnit:  item.costPerUnit,
          // currentStock update nahi kar rahe — existing stock preserve ho
        },
      });
      console.log(`  ↻  Updated : [${item.category}] ${item.name}`);
      updated++;
    } else {
      await Inventory.create({
        name:         item.name,
        category:     item.category,
        unit:         item.unit,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        costPerUnit:  item.costPerUnit,
        isActive:     true,
        branchId,
        createdBy,
      });
      console.log(`  ✓  Created : [${item.category}] ${item.name}`);
      created++;
    }
  }

  // ── Summary ───────────────────────────────────────────────────
  const categories = [...new Set(INVENTORY_ITEMS.map(i => i.category))];
  console.log('\n━━━ Summary ━━━');
  console.log(`  Total items    : ${INVENTORY_ITEMS.length}`);
  console.log(`  Created        : ${created}`);
  console.log(`  Updated        : ${updated}`);
  console.log(`  Categories (${categories.length}) : ${categories.join(', ')}`);
  console.log('\n✅  Inventory seed complete!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Inventory seed failed:', err);
  process.exit(1);
});