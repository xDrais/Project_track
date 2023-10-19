const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const passport = require('passport');
const User = require("./Models/user");


const GOOGLE_CLIENT_ID = "451412350838-khbv8dvibqhhj5n3hekhcidmk4r61a8k.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
const GITHUB_CLIENT_ID ="37e9e986ea001cafe03b"
const GITHUB_CLIENT_SECRET="2ef221090e8b3b29eb604fb16f8ba8d3d32216af"


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope:["profile","email"]
  },
  async function (accessToken, refreshToken, profile, done)  {
    //done(null,profile)
    try {
      
      const user = await User.findOne({  email: profile.emails[0].value  });
             if(!user){
            newUser=   new User({
                 email: profile.emails[0].value,
                 name: profile.displayName,
                 image:profile.photos[0].value,
                 provider: "google",
                })
                await newUser.save();
                return done(null, newUser);
              }
              else 
                return done(null, user);
              
            } catch (error) {
              return done(error);
             }

             
  }
));
passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
    scope:["profile","email"]
  },
  async function (accessToken, refreshToken, profile, done)  {
    done(null,profile)
    try {
        
        let user = User.findOne({  login: profile.id  });
               if(user){
              newUser=   new User({
                   //email: profile.emails[0].value,
                   name: profile.displayName,
                   image:profile.photos[0].value,
                   
                   provider: "github",
                  })
                   newUser.save();
                  return done(null, newUser);
                }
                else 
                  return done(null, user);
                
              } catch (error) {
                return done(error);
               }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

