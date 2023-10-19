const asynHandler = require("express-async-handler")
const Event = require('../../Models/event')
const User = require('../../Models/user')
const {  mailTransport } = require('../utils/mail.js')

const participate = asynHandler(async(req,res)=>{
    const {eventId , userId} = req.body
    const event = await Event.findById(eventId).populate("participant");
    const user = await User.findById(userId);
    if (event && user){
        if(event.participantsnumber>event.participant.length){
        event.participant.push(user)
        event.save()
        event.participant.map((e)=>{
        mailTransport().sendMail({
          from:"testtest150007@gmail.com",
          to: e.email,
          subject: "Meet Link",
          html: `<p> http://localhost:3000/video/${event._id} </p>`
      })
    })
        res.json({event}).status(200)
    }
    }else
    res.json({"message":"failed"}).status(400)
  })
const outparticipate = asynHandler(async(req,res)=>{
    const {eventId , userId} = req.body
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    console.log(event)
    console.log(user)
    if (event && user){
        event.participant.pop(user)
        event.save()
        res.json({event}).status(200)
    }else
    res.json({"message":"failed"}).status(400)
  })
const getparti = asynHandler(async(req,res)=>{
  const {eventId} =req.params
    const ev = await Event.findById(eventId);
    if (ev ){
       
        res.json({ev}).status(200)
    }else
    res.json({"message":"failed"}).status(400)
  })




  // afficher
      
  const getAllEvents = asynHandler(async(req,res)=>{
    
    const event = await Event.find();
    if (!event) {
        res.Error(404)
        throw new Error(" event Not Found !!")
    }
    res.json(event)
  
  })

  //get by id

  const getEventById = asynHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
      event.p
    if (event) {
      res.json(event)
    } else {
      res.status(404)
      throw new Error('event not found')
    }
  })

//delete

const deleteEvent = asynHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    await event.remove()
    res.json("event removed" )
  } else {
    res.status(404)
    throw new Error('event not found')
  }
})



//update event

const updateEvent = asynHandler(async (req, res) => {
  
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




module.exports = { participate,outparticipate,getparti,getAllEvents }