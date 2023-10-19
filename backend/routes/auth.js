
const routerr = require('express').Router()

const passport = require('passport')

routerr.get("/login/success" , (req , res)=>{
    if(req.user){
        res.status(200).json({
            error:false , 
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies,
            token:req.token
        });
    }else{
        res.status(403).json({
            error:true , 
            message:"Not Authorized",
        });
    }
  
})
 routerr.get("/google" , passport.authenticate("google",{scope:["profile"]}));
 routerr.get("/github" , passport.authenticate("github",{scope:["profile"]}));

routerr.get("/login/failed" , (req , res)=>{
    res.status(401).json({
        error:true , 
        message:"Log in failure",
    });
    
})

routerr.get(
    "/google/callback",
    passport.authenticate("google",{
        successRedirect: process.env.CLIENT_URL,
        failureRedirect:"/login/failed",
        accessType: 'offline',
        prompt: 'consent',
    }),

    routerr.get(
        "/github/callback",
        passport.authenticate("github",{
            successRedirect: process.env.CLIENT_URL,
            failureRedirect:"/login/failed",
            accessType: 'offline',
            prompt: 'consent',
        }),
        
       
    )
    
   
)

routerr.get("/logout",(req , res)=>{
    req.logout(),
    res.redirect('http://localhost:3000/')
})


  module.exports = routerr