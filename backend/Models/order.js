const mongoose =require ('mongoose')

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String,  },
        qty: { type: Number,  },
        image: { type: String,  },
        price: { type: Number,  },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        }
       
      },
    ],
    shippingAddress: {
      address: { type: String  },
      city: { type: String  },
      postalCode: { type: String  },
      country: { type: String  },
    },
    statusOrder : {
      type: Boolean,
      
      default: false,
    },
    paymentMethod: {
      type: String,
      
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Order', orderSchema)

