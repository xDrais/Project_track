const mongoose = require ('mongoose')

const RoleSchema = new mongoose.Schema({

    name : {type : String , required : true , default : "userRole"}
})

const UserSchema = new mongoose.Schema({
    email : {type : String , required:true, unique: true},
    lastName: {type: String,},
    firstName: {type:String,},
    cin: {type:Number,},
    password: {type:String,},
    phone: {type:String,} ,
    dateOfBirth: {type:Date,},
    imageUrl: {type:String},
    createdAt: {type:Date, default: Date.now},
    bloque: {type:Boolean, default: false},
    verify: {type:Boolean, default: false},
    emailToken:{ type: String},
    provider : {type: String,
        enum:['google','facebook','github']},
    role :RoleSchema,
    certified: {type:Boolean, default: false},
    status: {
        type: String,enum: ['pendingAsCoach','pendingAsSponsor', 'approved', 'rejected' ,'' , 'pending'],default: ''
    },
    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
      },

})
module.exports = mongoose.model('User', UserSchema)