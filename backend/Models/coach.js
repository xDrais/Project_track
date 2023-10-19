const mongoose = require ('mongoose')

const CoachSchema = new mongoose.Schema({
    user : {type: mongoose.Types.ObjectId,required:true,ref:"User"},
    file : {type: mongoose.Types.ObjectId,ref:"UploadFile"},
    speciality : {type : String , required : true },
    descriptionCoach : {type : String , required : true },
    dateDebutExperience : {type : Date , required : false },
    dateFinExperience : {type : Date , required : false},
    titrePoste : {type : String , required :false }

})
module.exports = mongoose.model('Coach', CoachSchema)
