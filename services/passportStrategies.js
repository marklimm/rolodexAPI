const passport = require('passport')

const Account = require('../models/account')
const config = require('../config')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt




//  create local strategy that will be used on sign in
const LocalStrategy = require('passport-local')
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, next){
    //  verify this username and password, call next with the user if a valid username/password

    Account.findOne({ email: email }, function(err, account){
        if(err){ return next(err) }

        if(!account){ return next(null, false) }

        //  compare passwords
        account.comparePassword(password, function(err, isMatch){
            if(err) { return next(err) }

            if(!isMatch){ return next(null, false) }

            //  this next() callback (supplied by passport) will assign the account object here to req.user
            return next(null, account)
        })
    })
})





//  setup options for JWT strategy
const jwtOptions = {

    //  this specifies where the JWT is on the request
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),

    //  specifying the secret key that should be used to decode the JWT
    secretOrKey: config.secret
}


//  create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    //  this event handler will fire whenever a request comes in that has a JWT
    //  payload = decoded JWT token

    const accountId = payload.sub

    //  see if accountId in the payload exists in our database
    Account.findById(accountId, function(err, account) {

        //  done(err, {account object})
        if(err){ return done(err, false) }

        if(account){
            done(null, account)
        }
        else{
            done(null, false)
        }

    })
});


//  tell passport to use these JWT and local strategies
passport.use(jwtLogin)
passport.use(localLogin)


