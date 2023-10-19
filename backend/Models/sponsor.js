const mongoose = require ('mongoose')

const SponsorSchema = new mongoose.Schema({
    user : {type: mongoose.Types.ObjectId,required:true,ref:"User"},
    file : {type: mongoose.Types.ObjectId,ref:"UploadFile"},
    entrepriseName : {type : String , required : true },
    sector : {type : String , required : true },
    descriptionSponsor : {type : String , required : true },
})
module.exports = mongoose.model('Sponsor', SponsorSchema)