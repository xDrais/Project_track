const mongoose = require ('mongoose')
const reviewSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number,  },
      comment: { type: String,  },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
  )


const ProductSchema = new mongoose.Schema({
    user : {type: mongoose.Types.ObjectId,ref:'User'},
    imageProduct: {
        type: String,
      },
      productName: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        default: 0,
      },
      countInStock: {
        type: Number,
        required: true,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      numReviews: {
        type: Number,
        default: 0,
      },
      reviews: [reviewSchema]

})
module.exports = mongoose.model('Product', ProductSchema)

