const asynHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const User = require('../Models/user.js')
const Coach = require('../Models/coach.js')
const Sponsor = require('../Models/sponsor.js')
const { generatorOTP ,mailTransport,generateToken } = require('./utils/mail.js')
const verficationToken = require('../Models/token.js')
const validator = require("email-validator");
const fs = require('fs')
const handlebars = require('handlebars');
const optGenerator = require('otp-generator')

const path = require("path");

const registerUser = asynHandler( async ( req , res )=> {
    const {  firstName ,
        lastName , 
        email , 
        password , 
        cin  ,
        dateOfBirth , 
        role ,
        phone, enrollment
    } = req.body
    const  imageUrl =req.file.filename 

    const { entrepriseName,sector,descriptionSponsor,file} = req.body
    const { speciality,descriptionCoach,dateDebutExperience ,
      dateFinExperience,
      titrePoste
      
  } = req.body


    if (!firstName || !lastName  ){
        res.json({"message":"Please add  all fields"}).status(400)
            throw new Error('Please add  all fields')
    }
    //verifier user exits by email
    const userExists  =  await User.findOne({email})
    if(userExists){
        res.status(401).send({ message: 'User with this E-mail adress already exists' });
        throw new Error('User with this E-mail adress already exists')
    }
    
    //bcryptjs password cryptage
    const salt = await bcrypt.genSalt(10)
    const headPassword = await bcrypt.hash(password,salt)

    const test = generatorOTP()


    const otp = generatorOTP()
     //expiration = new Date(expirationStr);



    //create user

    const user = await User.create({
        firstName ,
        lastName ,
        email , 
        password: headPassword  , 
        imageUrl ,
        cin ,
        dateOfBirth ,
        phone,
        status: entrepriseName  ? 'pendingAsSponsor' : speciality  ? 'pendingAsCoach' : '',
        role: {name: "userRole"},
                emailToken: otp, enrollment : {
                  completionStatus: 'Not started',
                  course: '6433be583b30a00a9d74e733',
                  enrollmentDate: "2023-04-10T07:44:24.122Z",
                  learner: '64234336c380a99f8bec23d8',
                  test: 'Not started',
                  createdAt: "2023-04-10T07:44:24.122Z",
                  updatedAt: "2023-04-10T07:44:24.122Z",
                  __v: 0,
                  _id: '6433be583b30a00a9d74e733'
              }

        
    })
    //Sponsor Creation
    console.log(file)
    const fil=file
    if (entrepriseName && sector && descriptionSponsor ){
        const sponsor = await Sponsor.create({
            user:user._id,
            entrepriseName:entrepriseName,
            sector:sector,
            descriptionSponsor:descriptionSponsor,
            file:fil
           
        })
            
    }
    

    console.log(speciality)
    console.log(descriptionCoach)
    console.log(dateDebutExperience)
    console.log(dateFinExperience)
    console.log(titrePoste)
    console.log("============================")

    console.log(entrepriseName)
    console.log(sector)
    console.log(descriptionSponsor)
        //Coach Creation

        if (speciality  ){
            const coach = await Coach.create({
            user:user._id,
            speciality:speciality,
            descriptionCoach:descriptionCoach,
            dateDebutExperience: dateDebutExperience,
            dateFinExperience : dateFinExperience,
            titrePoste: titrePoste,
            file:fil
        })
            
    }

    //const token = createToken(user._id);

    
    
    mailTransport().sendMail({
      from:"devtestmailer101@gmail.com",
      to: user.email,
     subject: "One Step To Verify Your Account ",
     html: `
       <html>
         <head>
           <style>
             h1 {
               color: #FFFFFF; 
               text-align: center;
             }
             p {
               color: #444444;
               font-size: 16px;
               text-align: justify;
             }
             a {
               color: #ffffff; 
               background-color: #AB7F42; 
               padding: 12px 24px;
               display: inline-block;
               text-decoration: none;
               border-radius: 4px;
             }
             a:hover {
               background-color: #007bff; 
             }
           </style>
         </head>
         <body>
           <table width="100%" border="0" cellspacing="0" cellpadding="0">
             <tr>
               <td align="center">
                 <img src="cid:logo" alt="Logo" style="max-width: 200px;">
                 <h1 style="color: #AB7F42; text-align: center;">Account Verified ${user.lastName}  </h1>
                 <h3 style="color: #444444; font-size: 16px; text-align: justify;">Dear ${user.firstName},</p>
                 <p style="color: #444444; font-size: 16px; text-align: justify;">We are pleased to inform you that your account has been successfully verified.</p>
                 <p style="color: #444444; font-size: 16px; text-align: justify;">Please follow the link below to complete the email verification process:</p>
                     <div style="text-align: center;">
                         <a href="${process.env.CLIENT_URL}/verify-email/${user.emailToken}"  style="color: #FFFFFF; background-color: #F8C471; padding: 12px 24px; display: inline-block; text-decoration: none; border-radius: 4px;">Verify your Email</a>
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
   


   if(user){
       res.status(201).json({
           _id: user.id,
           firstName: user.firstName,
           lastName: user.lastName,
           phone: user.phone,
           email: user.email,
           imageUrl: user.imageUrl,
           cin: user.cin,
           dateOfBirth: user.dateOfBirth,
           role : user.role,    
           verfication : user.emailToken,
           enrollment : user.enrollment
       })
   }
   else{
       res.status(400)
       throw new Error('Invalid user data')
   }

})

const ApproveUser = asynHandler( async (req, res) => {
    const id = req.params.id;
      const role = req.body.role;
      try {
        const user = await User.findById(id);
        if (user && user.status === 'pendingAsSponsor' ||'pendingAsCoach')  {
          user.role.name = role;
          user.status = 'approved';
          await user.save();
          res.send(`User ${user.firstName} approved and set to role ${role}`);
        } else {
          res.status(404).send('User not found or already approved/rejected');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
      });

const  verifyEmail = asynHandler( async (req,res) => {


    // const emailToken =req.body.emailToken; 

  const emailToken = req.params.token; 




// if true = email token is undefined 
  // if false = email token is defined
  console.log("emailToken is undefined:", !emailToken);

const user = await User.findOne({emailToken});
  if (!emailToken.trim()) {
    // email is incorrect
         console.log("Invalid emailToken :", emailToken);
         res.status(400);
         throw new Error("Invalid request");

  } else {

                if (!user) {
                  res.status(404);
                  throw new Error("User Not Found!!");
                }
              
                if (user.verify) {
                  res.status(400); 
                  throw new Error("User Already Verified!!");
                }
              
                if (!emailToken) {
                    res.status(404)
                    throw  new Error(" Invalid Token !! ")
                }
                if (user) {
                user.emailToken= null;
                user.verify=true;
                console.log(user.email);
              
                await user.save(); 
                    mailTransport().sendMail({
                      from: "devtestmailer101@gmail.com",
                      to: user.email,
                      subject: "Account Verified Succeffuly ",
                      html: `
                        <td align="center">
                        
                          <h1 style="color: #AB7F42; text-align: center;"> ${user.lastName} Your Account Is Verified </h1>
                          <h3 style="color: #444444; font-size: 16px; text-align: justify;">Dear ${user.firstName},</p>
                        <p>We are pleased to inform you that your account has been verified. You can now access all the features and services that we offer.</p>
                        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                        <p>Best regards,</p>
              
                        <h3 style="color: #444444; font-size: 16px; text-align: justify;">The CARTHAGE CARES Team</p>
                        </td>
                      `
                      
                    }); 
                    

                 
                    res.json(user)

  }
  
}
});
const logIn = asynHandler( async (req,res)=>{
        const  { email , password } = req.body
        
        const user = await User.findOne({ email: email }).populate('enrollment');
        const coach = await Coach.findOne({ user: user._id })
        const sponsor = await Sponsor.findOne({ user: user._id })

        if (user &&(await bcrypt.compare(password,user.password) ) ) {
          if (!user.enrollment) {
            user.enrollment = {
                completionStatus: 'Not started',
                course: 'Placeholder course id',
                enrollmentDate: 'Placeholder enrollment date',
                learner: 'Placeholder learner id',
                test: 'Not started',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0,
                _id: 'Placeholder enrollement id'
            };
        }
            res.json({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                phone: user.phone,
                cin: user.cin,
                role : user.role, 
                verify : user.verify,
                password: user.password, 
                bloque : user.bloque, 
                dateOfBirth : user.dateOfBirth, 
                token: generateToken(user._id),
                certified : user.certified,
                enrollement : user.enrollment,
                coach: coach,
                sponsor: sponsor
            })
            
        }else{
            res.status(400).json({message:'Invalid Credentials !'})
            throw new Error('Invalid Credentials !')
        }
})


const forgetPass = asynHandler(async (req,res)=>{
    const  { email } = req.body
if (!email ){
    res.status(404).json({"message":'Invalid email'})
  }
    const user = await User.findOne({ email: email })
    console.log(user)
    if(!user){
        res.status(404).json({"message":"Invalid User"})
    }
    const otp = optGenerator.generate(10, { specialChars: false });

    console.log(otp)
    console.log("================================")
    await verficationToken.create({
        owner : user._id,
        vtoken: otp
    })
    console.log("mail")
    fs.readFile('backend\\utils\\content.html', {encoding: 'utf-8'}, function (err, html) {
        if (err) {
          console.log(err);
        } else {
            console.log(otp)
            var template = handlebars.compile(html);
            var replacements = {
                name: user.lastName+" "+user.firstName,
                action_url: `http://localhost:3000/reset-password?id=${user._id}&token=${otp}`,
                
            };
            var htmlToSend = template(replacements);
    mailTransport().sendMail({
        from:"testtest150007@gmail.com",
        to: user.email,
        subject: "Rest Password Mail",
        html: htmlToSend
    })}})
   return res.json("done")
})
const reset = asynHandler(async ( req,res)=>{
    const { password } =req.body
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404).json({"message":"User Not Found !!"})
        throw new Error(" User Not Found !!")
    }
    const salt = await bcrypt.genSalt(10)
    const headPassword = await bcrypt.hash(password,salt)

    user.password = headPassword
    await verficationToken.deleteOne({ owner : user._id })
    await user.save()
    fs.readFile('backend\\utils\\index.html', {encoding: 'utf-8'}, function (err, html) {
        if (err) {
          console.log(err);
        } else {
            var template = handlebars.compile(html);
            var replacements = {
                action_url: `http://localhost:3000/login`,
            };
            var htmlToSend = template(replacements);
    mailTransport().sendMail({
        from: 'testtest150007@gmail.com',
        to: user.email,
        subject: 'password changed',
        html: htmlToSend
      })}})
     res.json(" Password Updated ")


})

//admin
const bloque = asynHandler( async(req,res)  =>{
    const  { id } =req.body
    const user = await User.findById(id)
    if (user.bloque==false){
  
         user.bloque=true
         await user.save()
         res.json("User blocked")
         console.log("user is blocked ")
    }
    else {
     res.Error(404)
     throw new Error(" User already blocked !!")
    }
  })
  
const Unbloque = asynHandler( async(req,res)  =>{
    const  { id } =req.body
    const user = await User.findById(id)
    if (user.bloque==true){
 
         user.bloque=false
         await user.save()
         res.json("User Unbloqued")
         console.log("user is Unblocked ")
    }
    else {
     res.Error(404)
     throw new Error(" User already Unblocked !!")
    }
 })
// Give Role admin
const makeAdmin = asynHandler( async(req,res)  =>{
    const  { id } =req.body
    const user = await User.findById(id)
    user.role.name="adminRole"
    await user.save()
    res.json("make it admin , Done !!")
 })
 const makeSponsor = asynHandler( async(req,res)  =>{
    const  { id } =req.body
    const user = await User.findById(id)
    user.role.name="sponsorRole"
    await user.save()
    res.json("make it sponsor , Done !!")
 })
 const makeCoach = asynHandler( async(req,res)  =>{
    const  { id } =req.body
    const user = await User.findById(id)
    user.role.name="coachRole"
    await user.save()
    res.json("make it coach , Done !!")
 })
 // Give Role Done
 //admin get all snponsors
 const test = asynHandler( async(req,res)  =>{
    //const  { id } =req.body
    const user = await Sponsor.find().populate('user')
    return res.json(user)
 })




//update for user
const updateUser = asynHandler(async(req,res)=>{
  const {  firstName , lastName ,phone, email ,password,dateOfBirth,cin} = req.body 
  const  imageUrl =req.file.filename 
  const user = await User.findById( req.params.id  )
  if(req.file.filename.length>0 ){
    const  imageUrl =req.file.filename 
  }
  else{
    const imageUrl = user.imageUrl
}
  if (password) {
      const salt = await bcrypt.genSalt(10)
      const headPassword = await bcrypt.hash(password,salt)
      if (user) {
          user.firstName = firstName  || user.firstName
          user.lastName  = lastName || user.lastName
          user.phone = phone || user.phone
          user.imageUrl = imageUrl || user.imageUrl
          if(validator.validate(email) ){ 
          user.email = email
          }
          else
          user.email =  user.email
          user.password = headPassword || user.password
          user.dateOfBirth = dateOfBirth || user.dateOfBirth
          user.cin = cin || user.cin
      }
  }
  if (user) {
      user.firstName = firstName  || user.firstName
      user.lastName  = lastName || user.lastName
      user.phone = phone || user.phone
      user.imageUrl = imageUrl || user.imageUrl
      user.dateOfBirth = dateOfBirth || user.dateOfBirth
      user.cin = cin || user.cin
      if(validator.validate(email) ){ 
      user.email = email
      }
      else
      user.email =  user.email
  }
  const updateUser = await user.save()
      res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      imageUrl: user.imageUrl,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      cin: user.cin,
      password: user.password,
  })
      
})



//update for Coach
const updateCoach = asynHandler(async(req,res)=>{
  const {firstName,lastName ,phone, email ,password,cin,dateOfBirth,speciality,descriptionCoach,dateDebutExperience,dateFinExperience,titrePoste,file} = req.body 
  const coach = await Coach.findById( req.params.id  )
  const coachUser = await User.findById(  coach.user.valueOf())
  const  imageUrl =  req.file.filename






  if (password) {
      const salt = await bcrypt.genSalt(10)
      const headPassword = await bcrypt.hash(password,salt)
      if (coachUser) {
        coachUser.firstName = firstName  || coachUser.firstName
          coachUser.lastName  = lastName || coachUser.lastName
          coachUser.phone = phone || coachUser.phone
          coachUser.cin = cin || coachUser.cin

          coachUser.imageUrl = imageUrl 

          if(validator.validate(email) )
          coachUser.email = email
          else
          coachUser.email =  coachUser.email
          coachUser.password = headPassword || coachUser.password
          coachUser.dateOfBirth = dateOfBirth || coachUser.dateOfBirth
          coach.speciality = speciality || coach.speciality
          coach.descriptionCoach = descriptionCoach || coach.descriptionCoach
          coach.dateDebutExperience = dateDebutExperience || coach.dateDebutExperience
          coach.dateFinExperience = dateFinExperience || coach.dateFinExperience
          coach.titrePoste = titrePoste || coach.titrePoste
          coach.file = file || coach.file
      }
      else {
        res.Error(404)
        throw new Error(" User not found ")
       }
  }
  if (coachUser) {
    coachUser.firstName = firstName  || coachUser.firstName
    coachUser.lastName  = lastName || coachUser.lastName
    coachUser.phone = phone || coachUser.phone
    coachUser.cin = cin || coachUser.cin
    coachUser.imageUrl = imageUrl || coachUser.imageUrl
    if(validator.validate(email) )
    coachUser.email = email
    else
    coachUser.email =  coachUser.email
    coachUser.dateOfBirth = dateOfBirth || coachUser.dateOfBirth
    coach.speciality = speciality || coach.speciality
    coach.descriptionCoach = descriptionCoach || coach.descriptionCoach
    coach.dateDebutExperience = dateDebutExperience || coach.dateDebutExperience
    coach.dateFinExperience = dateFinExperience || coach.dateFinExperience
    coach.titrePoste = titrePoste || coach.titrePoste
    coach.file = file || coach.file
  }
  const coachUserupdate = await coachUser.save()
  const coachupdate = await coach.save()
console.log(coachUser);
  res.json({
    _id: coachUser._id,
    firstName: coachUser.firstName,
    lastName: coachUser.lastName,
    phone: coachUser.phone,
    imageUrl: coachUser.imageUrl,
    email: coachUser.email,
    coachUser:coachUser.cin,
    password: coachUser.password,
    speciality:  coach.speciality ,
    descriptionCoach:coach.descriptionCoach,
    dateFinExperience:coach.dateFinExperience,
    titrePoste:coach.titrePoste,
    file:coach.file,
})
})



//update for sponsor
const updateSponsor = asynHandler(async(req,res)=>{
  const {firstName,lastName ,phone, email ,password,cin,dateOfBirth,entrepriseName,sector,descriptionSponsor,fil} = req.body 
  const  imageUrl =req.file.filename 

  const sponsor = await Sponsor.findById( req.params.id  )
  console.log(sponsor);
  const sponsorUser = await User.findById(  sponsor.user.valueOf())
  console.log(sponsorUser);

  if(!req.file){
   
    imageUrl = sponsorUser.imageUrl
  }
  else{
  const  imageUrl =req.file.filename 
}

  if (password) {
      
      const salt = await bcrypt.genSalt(10)
      const headPassword = await bcrypt.hash(password,salt)
  
      if (sponsorUser) {
          sponsorUser.firstName = firstName  || sponsorUser.firstName
          sponsorUser.lastName  = lastName || sponsorUser.lastName
          sponsorUser.phone = phone || sponsorUser.phone
          sponsorUser.cin = cin || sponsorUser.cin

          sponsorUser.imageUrl = imageUrl || sponsorUser.imageUrl
          if(validator.validate(email) )
          sponsorUser.email = email
          else
          sponsorUser.email =  sponsorUser.email
          sponsorUser.password = headPassword || sponsorUser.password
          sponsorUser.dateOfBirth = dateOfBirth || sponsorUser.dateOfBirth
          sponsor.entrepriseName = entrepriseName || sponsor.entrepriseName
          sponsor.sector = sector || sponsor.sector
          sponsor.descriptionSponsor = descriptionSponsor || sponsor.descriptionSponsor
          sponsor.file = fil || sponsor.file

      }
      else {
        res.Error(404)
        throw new Error(" User not found ")
       }
  }
  if (sponsorUser) {
      sponsorUser.firstName = firstName  || sponsorUser.firstName
      sponsorUser.lastName  = lastName || sponsorUser.lastName
      sponsorUser.phone = phone || sponsorUser.phone
      sponsorUser.cin = cin || sponsorUser.cin

      sponsorUser.imageUrl = imageUrl || sponsorUser.imageUrl
      if(validator.validate(email) )
      sponsorUser.email = email
      else
      sponsorUser.email =  sponsorUser.email
      sponsorUser.dateOfBirth = dateOfBirth || sponsorUser.dateOfBirth
      sponsor.entrepriseName = entrepriseName || sponsor.entrepriseName
      sponsor.sector = sector || sponsor.sector
      sponsor.descriptionSponsor = descriptionSponsor || sponsor.descriptionSponsor
      sponsor.file = fil || sponsor.file
  }
  const sponsorUserupdate = await sponsorUser.save()
  const sponsorupdate = await sponsor.save()

console.log(sponsorUser);
  res.json({
    _id: sponsorUser._id,
    firstName: sponsorUser.firstName,
    lastName: sponsorUser.lastName,
    phone: sponsorUser.phone,
    imageUrl: sponsorUser.imageUrl,
    email: sponsorUser.email,
    password: sponsorUser.password,
    entrepriseName:  sponsor.entrepriseName ,
    sector:sponsor.sector,
    descriptionSponsor:sponsor.descriptionSponsor,
    file:sponsor.file,
})
      
})






const findUserById = asynHandler(async(req,res)=>{
    const { id } = req.params
    const user = await User.findById( id ).select('-password')
    if (!user) {
        res.Error(404)
        throw new Error(" User Not Found !!")
    }
    res.json(user)

})

const getAllUser = asynHandler(async(req,res)=>{
    
    const user = await User.find( {}).select('-password')
    if (!user) {
        res.Error(404)
        throw new Error(" User Not Found !!")
    }
    res.json(user)

})

const GetSponsor = asynHandler(  async (req, res) => {
    try {
      const sponsor = await Sponsor.findOne({ user: req.params.userId }).populate('user');
      if (!sponsor) {
        return res.status(404).json({ message: 'Sponsor not found' });
      }
      res.json({ sponsor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

 const GetCoach = asynHandler( async(req,res)  =>{
    try {
        const coach = await Coach.findOne({ user: req.params.userId }).populate('user');
        if (!coach) {
          return res.status(404).json({ message: 'Coach not found' });
        }
        res.json({ coach });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
 })

 const Search = asynHandler( async (req, res) => {
    const key = req.params.key;
    
    const userResults = await User.find({
      $or: [
        { firstName: { $regex:  new RegExp(key, 'i')  } },
        { lastName: { $regex:  new RegExp(key, 'i')  } },
        { email: { $regex:  new RegExp(key, 'i')  } },
        { phone: { $regex:  new RegExp(key, 'i')  } },
      ],
    });
    
    const results = userResults;
    
    res.send(results);
  });
  
const coach = asynHandler(async (req,res)=>{
    const {user,file,speciality,descriptionCoach,dateDebutExperience,dateFinExperience,titrePoste}=req.body
    const{coach}=req.body
    console.log(coach)
    console.log(req.body)
    console.log("===============")
    console.log(file)
    console.log("===============")
    const z =await Coach.create({
      user:user,
      file:file,
      speciality:speciality,
      descriptionCoach:descriptionCoach,
      dateDebutExperience:dateDebutExperience,
      dateFinExperience:dateFinExperience,
      titrePoste:titrePoste
    })
    console.log("===============")
    console.log(z)
    res.status(201).json(z)

  })
  const sponsor = asynHandler(async (req,res)=>{
    const {user,file,entrepriseName,sector,descriptionSponsor}=req.body
    const sponsor = await Sponsor.create({
      user:user,
      file:file,
      entrepriseName:entrepriseName,
      sector:sector,
      descriptionSponsor:descriptionSponsor
    })
    res.status(201).json(sponsor)

  })
  

  //for chat 
  const allUsers = asynHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });
  
module.exports = { 
    registerUser,
    verifyEmail,
    logIn,
    bloque,
    makeAdmin,
    makeSponsor,
    makeCoach,
    reset,
    forgetPass,
    updateUser,
    updateSponsor,
    updateCoach,
    findUserById,
    getAllUser,
    ApproveUser,
    GetSponsor,
    GetCoach,
    Unbloque,
    Search,
    coach,
    sponsor,
    allUsers
    
 }