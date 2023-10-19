const jwt = require('jsonwebtoken')
const User = require('../Models/user.js')
const bcrypt =require('bcryptjs')
const asynHandler = require('express-async-handler')
const { isValidObjectId } =require("mongoose")
const verficationToken = require('../Models/token.js')



const protectSimpleUser = asynHandler(async (req,res,next)=>{
        let token 
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(" ")[1]
                const decoded = jwt.verify(token,process.env.jwt_Secret)
                req.user = await User.findById(decoded.id).select('-password')
                
                next()
            } catch (error) {
                console.log(error)
                res.status(401)
                throw new Error("Not Authorize")
            }
        }
        if (!token) {
            res.status(401)
            throw new Error("No Token")    
        }

})
const isAdmin  = asynHandler(async (req, res, next) => {
    if (req.user && req.user.role.name==="adminRole") {
      next()
    } else {
      res.status(401)
      throw new Error ('Not Authorized as an admin')
    }
  
  })

  const isCoach  = asynHandler(async (req, res, next) => {
    if (req.user && req.user.role.name==="coach") {
      next()
    } else {
      res.status(401)
      throw new Error ('Not Authorized as a couch')
    }
  
  })
const validator  = asynHandler(async (req, res, next) => {
    const {token,id} = req.query
    console.log("======")
    // console.log(token)
    //console.log(req.query)
    if (!token || !id ){
      res.status(404).json({"message":"Invalid request"})
      throw new Error(" Invalid request")
    }
    if(!isValidObjectId(id)){
      res.status(404).json({"message":"Invalid User"})
      throw new Error(" Invalid User")
    }
    const user = await User.findById(id)
    if (!user){
      res.status(404).json({"message":"User Not Found"})
      throw new Error("User Not Found ")
    }  
    const reset = await verficationToken.findOne({ owner : user._id })
    if(!reset){
      res.status(404).json({"message":"reset token not found"})
      throw new Error("reset token not found")
    }
    const isMatch = await bcrypt.compareSync(token,reset.vtoken)
    if (!isMatch) {
        res.status(404).json({"message":"Invalid Token !!"})
        throw  new Error(" Invalid Token !! ")
    }
    req.user=user
    next()
  })
module.exports={ protectSimpleUser, validator,isAdmin,isCoach }
