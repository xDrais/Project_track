const asynHandler = require("express-async-handler")
const Product = require('../Models/product.js')
const path = require("path");
const { mailTransport} = require('./utils/mail.js')

const createProduct = asynHandler(async (req, res) => {
 
      const {  
        productName ,
        price , 
        category , 
        countInStock ,
        description,
        user
      } = req.body
      const  imageProduct =req.file.filename 

      if (!productName || isNaN(price) || !category || isNaN(countInStock) || !description) {
        res.json({"message":"Please add  all fields"}).status(402)
            throw new Error('Please add  all fields')
    }
     
    const product = await Product.create({
      productName ,
            price , 
            user,
            category , 
            countInStock ,
            description,imageProduct
    })
   
   if(product){
      res.status(201).json({
          _id: product.id,
          productName: product.productName,
          user : product.user,
          price: product.price,
          category: product.category,
          countInStock: product.countInStock,
          description: product.description,
          imageProduct: product.imageProduct
      })
  }
 
  else{
      res.status(400)
      throw new Error('Invalid user data')
  }

})



const getAllProducts = asynHandler(async(req,res)=>{
    
  const product = await Product.find( {}).populate('user');
  if (!product) {
      res.Error(404)
      throw new Error(" Product Not Found !!")
  }
  res.json(product)

})
const getProductById = asynHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const GetProductsById = asynHandler(  async (req, res) => {
  try {
    const product = await Product.find( { user: req.params.userId } ).populate('user'); 
    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


const deleteProduct = asynHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json("Product removed" )
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const updateProduct = asynHandler(async (req, res) => {
  
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
  const {
    productName,
    price,
    description,
    category,
    countInStock
  } = req.body
 const  imageProduct =req.file?
 req.file.filename: null;

  const product = await Product.findById(req.params.id)

  if (product) {
    product.productName = productName
    product.price = price
    product.description = description
    product.category = category
    product.countInStock = countInStock
    product.imageProduct = imageProduct

    const updatedProduct = await product.save()
    if (updatedProduct){
      res.status(201).json({
        _id: product.id,
        productName: product.productName,
        user : product.user,
        price: product.price,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
        imageProduct: product.imageProduct
      })
    }
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const getProductByIdProduct = asynHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId)

  if (product) {
    res.json({
      _id: product.id,
      productName: product.productName,
      user : product.user,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
      imageProduct: product.imageProduct
    })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const SearchProduct = asynHandler( async (req, res) => {
  const key = req.params.key;
  
  const productResults = await Product.find({
    $or: [
      { name: { $regex:  new RegExp(key, 'i')  } },
      { category: { $regex:  new RegExp(key, 'i')  } },
      { description: { $regex:  new RegExp(key, 'i')  } },
    ],
  });

  const results = productResults;
  
  res.send(results);
});

//@Desc : If the user hasn't already reviewed the product, it creates a new review object with the user's name, rating, comment, and user id. It then pushes the new review into the reviews array of the product object, updates the numReviews field to reflect the new number of reviews, and calculates the new rating by taking the average of all the review ratings. 
//Create Review 
//@Route : POST /product/:id/reviews 
//@Access : Private 


const createReview = asynHandler(async (req, res) => {
  const {
   rating , comment 
  } = req.body

  const product = await Product.findById(req.params.id) //It proceeds to find the product by its id using Product.findById()

  if (product) {
   const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
   if (alreadyReviewed){
    res.status(400)
    throw new Error ('Product Already Reviewed')
   }
   const review ={
    name : req.user.firstName,
    rating : Number(rating),
    comment,
    user : req.user._id
   }
     product.reviews.push(review)
     product.numReviews = product.reviews.length 
     product.rating =product.reviews.reduce((acc , item)=> item.rating + acc , 0 )/
     product.reviews.length
     await product.save()
//   const updatedProduct = await product.save()
    res.status(201).json({ message : "Review added"})
  } else {
    res.status(404)
    throw new Error('Review not found')
  }
})

const updateStock = asynHandler(async (req, res) => {
  
  const {
    countInStock
  } = req.body


  const product = await Product.findById(req.params.id)

  if (product) {

    product.countInStock = countInStock


    const updateStock = await product.save()

   
      if (updateStock.countInStock === 0 ) {
         sendOutOfStockEmail(req, res);
      };
    
    if (updateStock){
      res.status(201).json({
        _id: product.id,
        productName: product.productName,
        user : product.user,
        price: product.price,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
        imageProduct: product.imageProduct
      })
    }
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const sendOutOfStockEmail = asynHandler(async  (req, res) => {
 
 const product = await Product.findById(req.params.id).populate('user');
  mailTransport().sendMail({
    from:"zainebhamdi2013@gmail.com",
    to: product.user.email, 
    subject: `Product out of stock: ${product.productName}`,
    html: `
    <html>
      <head>
        <style>
          /* Define your CSS styles here */
          h1 {
            color: #FFFFFF; /* Set header text color to blue */
            text-align: center;
          }
          p {
            color: #444444; /* Set paragraph text color to dark gray */
            font-size: 16px;
            text-align: justify;
          }
          a {
            color: #ffffff; /* Set link text color to white */
            background-color: #AB7F42; /* Set link background color to the desired color */
            padding: 12px 24px;
            display: inline-block;
            text-decoration: none;
            border-radius: 4px;
          }
          a:hover {
            background-color: #007bff; /* Set link background color to darker blue on hover */
          }
        </style>
      </head>
      <body>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <img src="cid:logo" alt="Logo" style="max-width: 200px;">
              <h3 style="color: #444444; font-size: 16px; text-align: justify;">Dear ${product.user.firstName},</p>
              <p style="color: #444444; font-size: 16px; text-align: justify;">This Product: ${product.productName} is out of stock .</p>
              <p style="color: #444444; font-size: 16px; text-align: justify;">Please check your shop and see last updates:</p>
                  <div style="text-align: center;">
                      <a href=""  style="color: #FFFFFF; background-color: #F8C471; padding: 12px 24px; display: inline-block; text-decoration: none; border-radius: 4px;">Check Your Shop</a>
                  </div>
              <p style="color: #444444; font-size: 16px; text-align: justify;">Thank you for choosing our services.</p>
              <p style="color: #444444; font-size: 16px; text-align: justify;">Sincerely,</p>
              <h3 style="color: #444444; font-size: 16px; text-align: justify;">The CARTHAGE CARES Team</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
  attachments: [{
    filename: 'logo.png',
    path: path.join(__dirname, '../../public/logo.png'),
    cid: 'logo'
  }]

  });
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${product.user.email}: ${mailOptions.subject}`);
  } catch (error) {
    console.error(`Error sending email to ${product.user.email}: ${error}`);
  }
});

const popularCategoryy = async (req, res) => {
  try {
    const products = await Product.find();
    const categories = {};

    products.forEach((product) => {
      if (!categories[product.category]) {
        categories[product.category] = 1;
      } else {
        categories[product.category]++;
      }
    });

    const categoryCount = Object.keys(categories).map((category) => ({
      category: category,
      count: categories[category],
    }));

    categoryCount.sort((a, b) => b.count - a.count);

    res.status(200).json(categoryCount);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { 
   createProduct,
   getAllProducts,
   deleteProduct,
   updateProduct,
   SearchProduct,
   GetProductsById,
   getProductById,
   createReview,
   getProductByIdProduct,
   updateStock,
   sendOutOfStockEmail,popularCategoryy

}
  