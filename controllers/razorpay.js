const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController = require('../controllers/users');

const amount = 25;

let options = {
  amount: amount * 100,
  currency: 'INR',
};

// GET => /checkout/ => INITIATE RAZORPAY ORDER INSTANCE AND GET ORDER INFO
exports.getOrderInfo = (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    instance.orders.create(options, async (err, order) => {
      if (err) throw new Error(JSON.stringify(err));

      // creating a order record with razorpay generated order_id
      await req.user.createOrder({ order_id: order.id });
      res.status(201).json({
        success: true,
        message: 'Razorpay order generation successful.',
        key_id: process.env.RAZORPAY_KEY_ID,
        order: order,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST => /checkout/update => UPDATE ORDER TABLE & USER TABLE
exports.postTransactionStatus = async (req, res, next) => {
  try {
    const payment_id = req.body.payment_id;
    const order_id = req.body.order_id;
    const signature = req.body.signature;

    const updatedOrder = await Order.findOne({ where: { order_id: order_id } });

    // update the order with payment_id & signature
    updatedOrder.payment_id = payment_id;
    updatedOrder.signature = signature;
    updatedOrder.save();

    const updatedUser = req.user.update({ isPremium: true });

    Promise.all([updatedOrder, updatedUser])
      .then(() => {
        console.log('Payment Successful');
        res.status(202).json({
          success: true,
          message: 'User is now premium.',
          // create new updated token with updated field
          token: userController.generateAccessToken(
            req.user.id,
            req.user.email,
            req.user.isPremium
          ),
        });

        // In the frontend it will store in the localStorage
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
