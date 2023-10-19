const path = require("path")
const { v4 : uuid4 } = require('uuid');
const multer = require('multer')
const express = require('express');
const { createProduct, getAllProducts ,getProductById, deleteProduct, updateProduct, SearchProduct, GetProductsById,createReview, getProductByIdProduct, updateStock, popularCategory, popularCategoryy } = require("../Controllers/productController");
const router = express.Router()
const { protectSimpleUser,validator,isAdmin }= require('../Middelware/userMiddelware.js')

 const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '../../frontend/public/images')); // use absolute path for uploaded files
  },
    filename: function(req, file, cb) {
      cb(null, uuid4()+ '-' + Date.now() + path.extname(file.originalname)); // specify the file name
    }
  });
  
  const fileFilter = (req,file,cb) =>{
    const allowedFileTypes = ['image/jpeg' , 'image/jpg' , 'image/png'];
    if(allowedFileTypes.includes(file.mimetype))
    {
        cb(null,true);
    } else {
        cb(null, false);
    }
  }
  // Create a new Multer upload instance
  let upload = multer({ storage, fileFilter});
router.post('/createProduct',upload.single('imageProduct') ,createProduct),
router.get('/getAll' ,getAllProducts),
router.get('/:id',getProductById),
router.delete('/delete/:id' ,deleteProduct),
router.put('/updateProduct/:id',upload.single('imageProduct')  ,updateProduct),
router.put('/updateStock/:id' ,updateStock),
router.get('/productByIdProduct/:productId',getProductByIdProduct),
router.get('/search/:key',SearchProduct),
router.get('/productById/:userId',GetProductsById)
router.get('/popularCategory',popularCategoryy)

router.post('/:id/reviews' ,protectSimpleUser, createReview)

module.exports = router