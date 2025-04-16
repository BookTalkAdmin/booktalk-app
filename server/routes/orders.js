const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.book')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price, 0);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' },
    });

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      total,
      shippingAddress,
      paymentIntentId: paymentIntent.id,
    });

    const savedOrder = await order.save();
    res.status(201).json({
      order: savedOrder,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.book')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
