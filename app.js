
//DEPENDENCIES IMPORT
const passport = require("passport");
const LinkedInOAuth = require("passport-linkedin-oauth2");
const session = require('express-session')
const express = require("express");
const CONSTANTS=require('./constants');

//Create a new Express App
const app = express();


//Serialize/Deserialize User
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//MIDDLEWARES

//Create a Session
app.use(session({ secret: process.env.SESSION_SECERT}));

//Initialize passport
app.use(passport.initialize());

//Create a passport session
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Create a LinkedIn Strategy
const LinkedInStrategy=LinkedInOAuth.Strategy

const LINKEDIN_CLIENTID = process.env.CLIENT_ID ;
const LINKEDIN_CLIENTSECRET = process.env.CLIENT_SECERT ;

const LINKEDIN_STRATEGY_OBJECT= {
  clientID: LINKEDIN_CLIENTID,
  clientSecret: LINKEDIN_CLIENTSECRET,
  callbackURL: `${CONSTANTS.Domain}:${CONSTANTS.PORT}${CONSTANTS.callbackUrl}`,
  scope: CONSTANTS.linkedInScopes,
}

passport.use(
  new LinkedInStrategy(LINKEDIN_STRATEGY_OBJECT,
    (
      accessToken,     
      refreshToken,
      profile,
      done
    ) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

app.get(CONSTANTS.authUrl,passport.authenticate(CONSTANTS.strategy, { state: '' }));


app.get(CONSTANTS.callbackUrl,passport.authenticate(CONSTANTS.strategy, {
    successRedirect: CONSTANTS.successUrl,
    failureRedirect: CONSTANTS.failureUrl,
  })
);

app.get("/", (req, res) => {
  const user=req.user;
  if (user) {
    const firstName = user.name.givenName;
    const photo = user.photos[0].value;
    res.send(
      `<div style="text-align:center; width:100%; margin: 200px 0px;">
        <h1 style="font-family: sans-serif;"> Hey ${firstName} 👋</h1>
        <p style="font-family: sans-serif;"> You've successfully logged in with your Linkedn Account 👏 </p>
        <img src="${photo}"/>
      </div>
      `
    )
  } else {
    res.send(
    `<div style="text-align:center; width:100%; margin: 200px 0px;"> 
          <h1 style="font-family: sans-serif;">Welcome to LinkedIn OAuth App</h1>
          <img style="cursor:pointer;margin-top:20px"  onclick="window.location='/auth/linkedIn'" src="https://dryfta.com/wp-content/uploads/2017/04/Linkedin-customized-button.png"/>
    </div>
    `);
  }
});

app.listen(CONSTANTS.PORT);
