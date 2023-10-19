const express =require('express')
const multer =require('multer')
const path =require('path')
const router = express.Router()
const UploadFile = require('../Models/UploadFile')

const storage=multer.diskStorage({
    destination(req,file,cb){
        cb(null,path.join(__dirname, '../../frontend/public/images'))
    },
    filename(req,file,cb){
        
        cb(null,`${file.fieldname}-${Date.now()}${path
            .extname(file.originalname)}`)
    }
})

function checkFileType (file,cb){
    const filetypes = /jpeg|jpg|png/
    const extname= filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(extname && mimetype){
        return cb(null,true)
    }else{
        cb( "wrong")
    }
}
const upload = multer({ storage: storage,
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
})
router.post('/',(req,res)=>{ 
    upload.single('imageUrl')(req,res,async function(err){
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.            
            res.json({"success":false,"message":"multer uploading err"}).status(400)
          } else if (err) {
            // An unknown error occurred when uploading.

            res.json({"success":false,"message":"Format err"}).status(400)
          }else{
          
            res.json({"success":true,"message":`${req.file.filename}`}).status(200)
        
        }
    })
    
  //res.json({"success":true,"path":req.file.path})
    
    //res.send(`/${req.file.path}`)
})


module.exports=router
