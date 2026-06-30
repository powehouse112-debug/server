const mongoose = require('mongoose');
const Counter = require('../models/Counter');

let _orderCounterSynced = false; // process lifetime mein sirf 1 baar check hoga

const generateOrderNumber = async () => {
  const Order = mongoose.model('Order');

  // ✅ Sirf EK BAAR (jab tak server restart na ho) Counter ko Order collection
  //    ke max existing number se sync karo — taake purana/galat Counter fix ho jaye.
  //    Iske baad har order pe ye slow regex-scan nahi chalega.
  if (!_orderCounterSynced) {
    const lastOrder = await Order.findOne(
      { orderNumber: { $regex: /^ORD-\d+$/ } },
      { orderNumber: 1 },
      { sort: { createdAt: -1 } }
    );

    let maxExisting = 0;
    if (lastOrder) {
      const num = parseInt(lastOrder.orderNumber.replace('ORD-', ''));
      maxExisting = isNaN(num) ? 0 : num;
    }

    await Counter.findByIdAndUpdate(
      'orderNumber',
      [
        {
          $set: {
            seq: {
              $cond: {
                if: { $lte: ['$seq', maxExisting] },
                then: maxExisting,
                else: '$seq',
              },
            },
          },
        },
      ],
      { upsert: true }
    );

    _orderCounterSynced = true; // ✅ ab future calls fast path lengi
  }

  // ✅ Fast path — har order ke liye sirf yahi chalega (1 atomic DB call, no scan)
  const updated = await Counter.findByIdAndUpdate(
    'orderNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `ORD-${String(updated.seq).padStart(4, '0')}`;
};

const calculateTotalTime = (items) => {
  if (!items || items.length === 0) return 0;
  return Math.max(...items.map(item => item.preparationTime || 0));
};

const calculateOrderTotal = (items, discount = 0, taxRate = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax - discount;
  return { subtotal, tax, total };
};
//Asad

module.exports = {
  generateOrderNumber,
  calculateTotalTime,
  calculateOrderTotal,
};