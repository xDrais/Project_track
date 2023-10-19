const mongoose = require ('mongoose')

const EventSchema = new mongoose.Schema({
    eventCreator : {type: mongoose.Types.ObjectId,required:true,ref:"User"},
    name : {type : String , required : true },
    description : {type : String , required : true },
    dateStart: {type : Date , required : false ,default: Date.now() },
    dateEnd: {type : Date , required : false},
    participantsnumber: {type : Number , required : false},
    imageUrl: {type:String},
    participant:[{type: mongoose.Types.ObjectId,ref:"User"}]
})
module.exports = mongoose.model('Event', EventSchema)
