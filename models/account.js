const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')


//  this account schema represents an individual login account for users to login to the rolodex application


//  define our model
const accountSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

    firstName: String,
    lastName: String
})



//  on save hook, encrypt password
//  accountSchema.pre() means before saving a model, run this function
accountSchema.pre('save', function(next){
    const user = this;

    console.log('inside accountSchema.pre(save)')

    //  generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt){
        if(err){ return next(err)}

        //  hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err){ return next(err)}

            //  overwrite plain text password with encrypted password
            user.password = hash;
            next();
        })
    })


})


accountSchema.methods.comparePassword = function(candidatePassword, callback){

    //  bcrypt is doing the comparison for us behind the scenes.  It's taking the salt and combining that with the candidatePassword to produce a hashed password.  Then it compares that hashed password with this.password
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){ return callback(err); }

        callback(null, isMatch)
    })


}



//  load the schema into mongoose and then export the model
module.exports = mongoose.model('account', accountSchema)


