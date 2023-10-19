const asyncHandler = require("express-async-handler")
const Order = require('../Models/order.js')
const User = require('../Models/user.js')
const Product = require('../Models/product.js')
const order = require("../Models/order.js")



// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    // set a timeout for 2 minutes to delete the order if it's not approved
    setTimeout(async () => {
      const order = await Order.findById(createdOrder._id)
      if (order && !order.statusOrder) {
        await order.remove()
        console.log(`Order ${order._id} deleted.`)
      }
    }, 2 * 60 * 1000)

    res.status(201).json(createdOrder)
  }
})


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
// const getOrderById = asyncHandler(async (req, res) => {

//   try {
//     const order = await Order.findById(req.params.id).populate('orderItems.product');
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.json(order.orderItems);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// })
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

const getProductUsersIdByOrderId = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'orderItems.product',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    .populate('user', 'name email');
  const userIds = order.orderItems.map((item) => item.product.user._id.toString());
  console.log(userIds);
  res.status(201).json(userIds);
});


const getProductUsersIdByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const products = await Product.find({ user: userId }).select('_id');

  const productIds = products.map(product => product._id.toString());

  const orders = await Order.find({ 'orderItems.product': { $in: productIds } }).populate('user', 'name email');

  res.status(200).json(orders);
});


const OrderApprove = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    order.statusOrder = true
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
});




// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()

    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// get all orders
const getOrders = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId, token: req.headers.authorization });

  if (!user) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  // Find all orders for the authenticated user
  const orders = await Order.find({ user: userId }).populate('user', 'name email');
  if (!orders) {
    res.status(401);
    throw new Error('Order not found for this user');
  }
  res.json(orders);
});
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
const bestSpecificSeller = asyncHandler(async (req, res) => {
  try {
    const products = req.body; // assuming the products array is passed in the request body
    const bestSellers = products.reduce((acc, curr) => {
      acc[curr._id] = {
        productName: curr.productName,
        count: 0,
      };
      return acc;
    }, {});
    const orders = await Order.find({ statusOrder: true }).populate('orderItems.product', 'productName category price imageProduct rating numReviews' );
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.product && item.product._id) {
          if (bestSellers[item.product._id]) {
            bestSellers[item.product._id].count += item.qty;
          }
        }
      });
    });

    const sortedProducts = Object.values(bestSellers).sort((a, b) => b.count - a.count);
    const topBestSellers = sortedProducts.slice(0, 3);

    res.json(topBestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const bestSeller = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ statusOrder: true }).populate('orderItems.product', 'productName category price imageProduct rating numReviews' );
    const products = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.product && item.product._id) {
          if (!products[item.product._id]) {
            products[item.product._id] = {
              _id: item.product._id,
              productName: item.product.productName,
              category: item.product.category,
              imageProduct: item.product.imageProduct,
              price: item.product.price,
              rating: item.product.rating,
              numReviews: item.product.numReviews,
              count: 0,
            };
          }
          products[item.product._id].count += item.qty;
        }
        
      });
    });
    const sortedProducts = Object.values(products).sort((a, b) => b.count - a.count);
    const bestSellers = sortedProducts;
    res.json(bestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// orders in profile
const getProductsOrderByIdOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product',
      select: 'productName imageProduct countInStock category',
    },
  });

  if (order) {
    const productDetails = order.orderItems.map((item) => ({
      productName: item.product.productName,
      imageProduct: item.product.imageProduct,
      countInStock: item.product.countInStock,
      category: item.product.category,
      qty: item.qty,
    }));
    res.json(productDetails);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }

 })
 
//order dashboard
const getProductsDashboard = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

 const order = await Order.findById(req.params.id).populate({
  path: 'orderItems',
  populate: {
    path: 'product',
    model: 'Product',
    select: 'productName imageProduct countInStock category price id',
    match: { user: req.params.userId }
  },
  match: { user: req.params.userId }
});

if (order && user) {
  const filteredItems = order.orderItems.filter(item => item.product);
    const productDetails = filteredItems.map(item => ({
      productName: item.product.productName,
      id: item.product.id,
      imageProduct: item.product.imageProduct,
      countInStock: item.product.countInStock,
      category: item.product.category,
      price: item.product.price,
      qty: item.qty,
      idOrder: order._id,
    }));

  res.json(productDetails);
} else {
  res.status(404);
  throw new Error('Order not found');
}
});

//remove product from order
const removeProductFromOrder = asyncHandler(async (req, res) => {
  const { userId, orderId, productId } = req.params;

  // Find the user and order
  const user = await User.findById(userId);
  const order = await Order.findById(orderId);

  // Check if the user and order exist
  if (!user) {
    res.status(404);
    throw new Error('User  not found');
  }
  if (!order) {
    res.status(404);
    throw new Error('order not found');
  }

  // Remove the product from the order
  if (order.orderItems && order.orderItems.length > 0) {
    const index = order.orderItems.findIndex(item => item.product.toString() === productId);
    if (index !== -1) {
      order.orderItems.splice(index, 1);
      await order.save();
      res.status(200).json({ message: 'Product removed from order' });
    } else {
      res.status(404);
      throw new Error('Product not found in order');
    }
  } else {
    res.status(404);
    throw new Error('No products found in order');
  }
});




module.exports = {
  addOrderItems, getOrderById, updateOrderToPaid,
  getOrders, updateOrderToDelivered,
  getProductUsersIdByOrderId,
  getProductUsersIdByUserId,
  OrderApprove
  ,bestSpecificSeller,
  getProductsOrderByIdOrder,
  getProductsDashboard,
  removeProductFromOrder,
  getAllOrders,
  bestSeller
}