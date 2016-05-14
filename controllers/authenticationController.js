const jwt = require('jwt-simple')

const Account = require('../models/account')
const config = require('../config')

function tokenForAccount(authenticatedAccount){

    const timestamp = new Date().getTime()

    //  "sub" is short for subject.  The subject of this token is this specific account
    //  "iat" is issued at time.
    return jwt.encode({ sub: authenticatedAccount.id, iat: timestamp }, config.secret);
}


exports.signin = function(req, res, next){

    //  account has already had their email/password authenticated
    // `req.user` contains the authenticated user

    //  respond to request indicating the account was created
    res.json({token: tokenForAccount(req.user)})

}


exports.signup = function(req, res, next){
    //res.send({ success: 'true' })


    //console.log(req.body)

    const email = req.body.email
    const password = req.body.password


    if(!email || !password){
        return res.status(422).send({ error: 'You must provide an email and password'})
    }

    //  see if an Account with the given email exists
    Account.findOne({ email: email }, function(err, existingAccount){

        if(err){ return next(err); }

        //  if email does exist --> return a message saying the email's already in use
        if(existingAccount){
            //  422 - unprocessable entity
            return res.status(422).send({ error: 'This email address already has an account with rolodexAPI' })
        }

        //  if email doesn't exist --> create and save user record
        const newAccount = new Account({
            email: email,
            password: password
        })

        newAccount.save(function(err){
            if(err){ return next(err) }

            //  respond to request indicating the newAccount was created
            res.json({ token: tokenForAccount(newAccount) })
        });


    })


}



