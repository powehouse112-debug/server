require('dotenv').config();
const mongoose = require('mongoose');

// ── Schemas (inline) ──────────────────────────────────────────────────────────
const sizeVariantSchema = new mongoose.Schema({
  size:          { type: String, required: true },
  purchasePrice: { type: Number, required: true, default: 0 },
  salePrice:     { type: Number, required: true, default: 0 },
  currentStock:  { type: Number, default: 0 },
  minimumStock:  { type: Number, default: 5 },
  expiryDate:    { type: Date },
}, { _id: true });

const coldDrinkSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  company:  { type: String, required: true, trim: true },
  sizes:    { type: [sizeVariantSchema], default: [] },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  isActive: { type: Boolean, default: true },
  notes:    { type: String },
}, { timestamps: true });

const branchSchema = new mongoose.Schema({
  name: String, address: String, city: String,
  phone: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: String, role: String,
}, { timestamps: true });

const ColdDrink = mongoose.models.ColdDrink || mongoose.model('ColdDrink', coldDrinkSchema);
const Branch    = mongoose.models.Branch    || mongoose.model('Branch',    branchSchema);
const User      = mongoose.models.User      || mongoose.model('User',      userSchema);

// ── Config ────────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌  MONGODB_URI .env mein set karo'); process.exit(1); }

// ─────────────────────────────────────────────────────────────────────────────
// COLD DRINKS DATA
// purchasePrice / salePrice = PKR approximate — apni marzi se update karo
// currentStock = starting stock (pehli baar seed pe set hoga)
// minimumStock = reorder alert
// ─────────────────────────────────────────────────────────────────────────────

const COLD_DRINKS = [

  // ══════════════════════════════════════════════════════════════
  // PEPSICO
  // ══════════════════════════════════════════════════════════════
  {
    company: 'PepsiCo',
    name: 'Pepsi',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 24, minimumStock: 10 },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 170, salePrice: 250, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'PepsiCo',
    name: '7Up',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 24, minimumStock: 10 },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 170, salePrice: 250, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'PepsiCo',
    name: 'Mirinda Orange',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 12, minimumStock: 6  },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'PepsiCo',
    name: 'Mountain Dew',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 24, minimumStock: 10 },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 170, salePrice: 250, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'PepsiCo',
    name: 'Sting Energy',
    notes: 'Energy drink — red & gold variants',
    sizes: [
      { size: '250ml Can',  purchasePrice: 70,  salePrice: 100, currentStock: 24, minimumStock: 10 },
      { size: '500ml',      purchasePrice: 110, salePrice: 160, currentStock: 12, minimumStock: 6  },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // COCA-COLA
  // ══════════════════════════════════════════════════════════════
  {
    company: 'Coca-Cola',
    name: 'Coca-Cola',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 24, minimumStock: 10 },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 170, salePrice: 250, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Coca-Cola',
    name: 'Sprite',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 24, minimumStock: 10 },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 170, salePrice: 250, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Coca-Cola',
    name: 'Fanta Orange',
    sizes: [
      { size: '250ml Can',  purchasePrice: 55,  salePrice: 80,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 80,  salePrice: 120, currentStock: 12, minimumStock: 6  },
      { size: '1 Liter',    purchasePrice: 100, salePrice: 150, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 130, salePrice: 190, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Coca-Cola',
    name: 'Kinley Water',
    notes: 'Coca-Cola ka mineral water brand',
    sizes: [
      { size: '500ml',     purchasePrice: 20, salePrice: 40, currentStock: 48, minimumStock: 20 },
      { size: '1 Liter',   purchasePrice: 30, salePrice: 60, currentStock: 24, minimumStock: 10 },
      { size: '1.5 Liter', purchasePrice: 40, salePrice: 80, currentStock: 24, minimumStock: 10 },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // SUFI (Pakistani Brand)
  // ══════════════════════════════════════════════════════════════
  {
    company: 'Sufi',
    name: 'Sufi Cola',
    notes: 'Pakistani local cola brand',
    sizes: [
      { size: '250ml',      purchasePrice: 35,  salePrice: 60,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 55,  salePrice: 90,  currentStock: 24, minimumStock: 12 },
      { size: '1 Liter',    purchasePrice: 75,  salePrice: 120, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 100, salePrice: 160, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 130, salePrice: 210, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Sufi',
    name: 'Sufi Lemon Up',
    notes: 'Sufi ka lemon flavor — 7Up alternative',
    sizes: [
      { size: '250ml',      purchasePrice: 35,  salePrice: 60,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 55,  salePrice: 90,  currentStock: 24, minimumStock: 12 },
      { size: '1 Liter',    purchasePrice: 75,  salePrice: 120, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 100, salePrice: 160, currentStock: 12, minimumStock: 6  },
      { size: '2.25 Liter', purchasePrice: 130, salePrice: 210, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Sufi',
    name: 'Sufi Orange',
    notes: 'Sufi ka orange flavor',
    sizes: [
      { size: '250ml',      purchasePrice: 35,  salePrice: 60,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 55,  salePrice: 90,  currentStock: 12, minimumStock: 6  },
      { size: '1 Liter',    purchasePrice: 75,  salePrice: 120, currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 100, salePrice: 160, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Sufi',
    name: 'Sufi Apple',
    notes: 'Sufi ka apple flavor',
    sizes: [
      { size: '250ml',      purchasePrice: 35,  salePrice: 60,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',      purchasePrice: 55,  salePrice: 90,  currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',  purchasePrice: 100, salePrice: 160, currentStock: 6,  minimumStock: 3  },
    ],
  },
  {
    company: 'Sufi',
    name: 'Sufi Mineral Water',
    notes: 'Sufi ka mineral water',
    sizes: [
      { size: '500ml',     purchasePrice: 18, salePrice: 35, currentStock: 48, minimumStock: 20 },
      { size: '1 Liter',   purchasePrice: 28, salePrice: 55, currentStock: 24, minimumStock: 10 },
      { size: '1.5 Liter', purchasePrice: 38, salePrice: 70, currentStock: 24, minimumStock: 10 },
      { size: '5 Liter',   purchasePrice: 60, salePrice: 100, currentStock: 10, minimumStock: 4  },
      { size: '19 Liter',  purchasePrice: 150, salePrice: 200, currentStock: 5, minimumStock: 2  },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // GLASS BOTTLE COLD DRINKS (Returnable/Non-returnable)
  // ══════════════════════════════════════════════════════════════
  {
    company: 'PepsiCo',
    name: 'Pepsi (Glass)',
    notes: 'Glass bottle — traditional chilled cold drink',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70, currentStock: 24, minimumStock: 12 },
      { size: '1 Liter Glass', purchasePrice: 85, salePrice: 130, currentStock: 12, minimumStock: 6 },
    ],
  },
  {
    company: 'PepsiCo',
    name: '7Up (Glass)',
    notes: 'Glass bottle',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70, currentStock: 24, minimumStock: 12 },
      { size: '1 Liter Glass', purchasePrice: 85, salePrice: 130, currentStock: 12, minimumStock: 6 },
    ],
  },
  {
    company: 'Coca-Cola',
    name: 'Coca-Cola (Glass)',
    notes: 'Glass bottle',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70, currentStock: 24, minimumStock: 12 },
      { size: '1 Liter Glass', purchasePrice: 85, salePrice: 130, currentStock: 12, minimumStock: 6 },
    ],
  },
  {
    company: 'Coca-Cola',
    name: 'Sprite (Glass)',
    notes: 'Glass bottle',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70, currentStock: 24, minimumStock: 12 },
      { size: '1 Liter Glass', purchasePrice: 85, salePrice: 130, currentStock: 12, minimumStock: 6 },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // PAKOLA (Pakistani Heritage Brand — Glass Bottles)
  // ══════════════════════════════════════════════════════════════
  {
    company: 'Pakola',
    name: 'Pakola Ice Cream Soda',
    notes: 'Iconic Pakistani green drink — glass bottle',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',       purchasePrice: 65, salePrice: 100, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Pakola',
    name: 'Pakola Orange',
    notes: 'Pakola orange flavor — glass bottle',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',       purchasePrice: 65, salePrice: 100, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Pakola',
    name: 'Pakola Lychee',
    notes: 'Pakola lychee flavor',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',       purchasePrice: 65, salePrice: 100, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Pakola',
    name: 'Pakola Mango',
    notes: 'Pakola mango flavor',
    sizes: [
      { size: '250ml Glass', purchasePrice: 40, salePrice: 70, currentStock: 12, minimumStock: 6 },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // RC COLA (Glass / Bottle)
  // ══════════════════════════════════════════════════════════════
  {
    company: 'RC Cola',
    name: 'RC Cola',
    notes: 'Royal Crown Cola',
    sizes: [
      { size: '250ml Glass', purchasePrice: 38, salePrice: 65,  currentStock: 24, minimumStock: 12 },
      { size: '500ml',       purchasePrice: 60, salePrice: 95,  currentStock: 12, minimumStock: 6  },
      { size: '1.5 Liter',   purchasePrice: 110, salePrice: 170, currentStock: 6, minimumStock: 3  },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // NESTLE WATER
  // ══════════════════════════════════════════════════════════════
  {
    company: 'Nestle',
    name: 'Nestle Pure Life Water',
    notes: 'Mineral water',
    sizes: [
      { size: '500ml',     purchasePrice: 22, salePrice: 40,  currentStock: 48, minimumStock: 24 },
      { size: '1 Liter',   purchasePrice: 32, salePrice: 60,  currentStock: 24, minimumStock: 10 },
      { size: '1.5 Liter', purchasePrice: 42, salePrice: 80,  currentStock: 24, minimumStock: 10 },
      { size: '5 Liter',   purchasePrice: 65, salePrice: 110, currentStock: 10, minimumStock: 4  },
      { size: '19 Liter',  purchasePrice: 160, salePrice: 220, currentStock: 5, minimumStock: 2  },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // AQUAFINA WATER
  // ══════════════════════════════════════════════════════════════
  {
    company: 'PepsiCo',
    name: 'Aquafina Water',
    notes: 'PepsiCo ka mineral water brand',
    sizes: [
      { size: '500ml',     purchasePrice: 20, salePrice: 40, currentStock: 48, minimumStock: 24 },
      { size: '1 Liter',   purchasePrice: 30, salePrice: 60, currentStock: 24, minimumStock: 10 },
      { size: '1.5 Liter', purchasePrice: 40, salePrice: 80, currentStock: 24, minimumStock: 10 },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // JUICES (Tetra Pack / Bottle)
  // ══════════════════════════════════════════════════════════════
  {
    company: 'Nestle',
    name: 'Nestle Fruita Vitals (Mango)',
    notes: 'Tetra pack mango juice',
    sizes: [
      { size: '200ml',  purchasePrice: 35,  salePrice: 60,  currentStock: 24, minimumStock: 10 },
      { size: '1 Liter', purchasePrice: 130, salePrice: 200, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Nestle',
    name: 'Nestle Fruita Vitals (Apple)',
    notes: 'Tetra pack apple juice',
    sizes: [
      { size: '200ml',   purchasePrice: 35,  salePrice: 60,  currentStock: 24, minimumStock: 10 },
      { size: '1 Liter', purchasePrice: 130, salePrice: 200, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Shezan',
    name: 'Shezan Mango Juice',
    notes: 'Tetra pack / bottle',
    sizes: [
      { size: '200ml',   purchasePrice: 30,  salePrice: 55,  currentStock: 24, minimumStock: 10 },
      { size: '1 Liter', purchasePrice: 120, salePrice: 190, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Shezan',
    name: 'Shezan Apple Juice',
    notes: 'Tetra pack',
    sizes: [
      { size: '200ml',   purchasePrice: 30,  salePrice: 55, currentStock: 24, minimumStock: 10 },
      { size: '1 Liter', purchasePrice: 120, salePrice: 190, currentStock: 12, minimumStock: 6  },
    ],
  },
  {
    company: 'Olper\'s',
    name: 'Olper\'s Flavored Milk (Mango)',
    notes: 'Flavored milk tetra pack',
    sizes: [
      { size: '200ml', purchasePrice: 45, salePrice: 75, currentStock: 24, minimumStock: 10 },
    ],
  },
  {
    company: 'Olper\'s',
    name: 'Olper\'s Flavored Milk (Strawberry)',
    notes: 'Flavored milk tetra pack',
    sizes: [
      { size: '200ml', purchasePrice: 45, salePrice: 75, currentStock: 24, minimumStock: 10 },
    ],
  },

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

  console.log('━━━ Seeding Cold Drinks ━━━');
  let created = 0, updated = 0;

  for (const item of COLD_DRINKS) {
    const existing = await ColdDrink.findOne({ name: item.name, branchId });

    if (existing) {
      // Naye sizes add karo jo pehle nahi the — existing sizes preserve
      for (const newSize of item.sizes) {
        const alreadyExists = existing.sizes.find(s => s.size === newSize.size);
        if (!alreadyExists) {
          existing.sizes.push(newSize);
        }
        // Agar already exists — prices update karo but stock preserve
        else {
          alreadyExists.purchasePrice = newSize.purchasePrice;
          alreadyExists.salePrice     = newSize.salePrice;
          alreadyExists.minimumStock  = newSize.minimumStock;
        }
      }
      if (item.notes) existing.notes = item.notes;
      await existing.save();
      console.log(`  ↻  Updated : [${item.company}] ${item.name}  (${item.sizes.length} sizes)`);
      updated++;
    } else {
      await ColdDrink.create({
        name:     item.name,
        company:  item.company,
        sizes:    item.sizes,
        notes:    item.notes || '',
        isActive: true,
        branchId,
      });
      console.log(`  ✓  Created : [${item.company}] ${item.name}  (${item.sizes.length} sizes)`);
      created++;
    }
  }

  // ── Summary ───────────────────────────────────────────────────
  const companies = [...new Set(COLD_DRINKS.map(d => d.company))];
  const totalSizes = COLD_DRINKS.reduce((acc, d) => acc + d.sizes.length, 0);

  console.log('\n━━━ Summary ━━━');
  console.log(`  Total drinks   : ${COLD_DRINKS.length}`);
  console.log(`  Total sizes    : ${totalSizes}`);
  console.log(`  Created        : ${created}`);
  console.log(`  Updated        : ${updated}`);
  console.log(`  Companies (${companies.length}) : ${companies.join(', ')}`);
  console.log('\n✅  Cold drinks seed complete!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Cold drinks seed failed:', err);
  process.exit(1);
});