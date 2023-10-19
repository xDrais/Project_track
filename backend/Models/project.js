const mongoose = require ('mongoose')

const CommentSchema = new mongoose.Schema({
    like:{type:Boolean,default: false},
    msg : {type : String },
    user : {type: mongoose.Types.ObjectId,required:true,ref:"User"},
})
const ProjectSchema = new mongoose.Schema({
    projectCreator : {type: mongoose.Types.ObjectId,required:true,ref:"User"},
    name : {type : String , required : true },
    description : {type : String , required : true },
    dateStart: {type : Date , required : false ,default: Date.now() },
    imageUrl: {type:String},
    ammounttocollect:{type: Number},
    comment:[CommentSchema]

})
module.exports = mongoose.model('Project', ProjectSchema)
