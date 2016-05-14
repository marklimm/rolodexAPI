var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//  this person schema represents an individual person in the rolodex

var PersonSchema = new Schema({
    firstName: String,
    lastName: String,
    fullName: String,

    description: String,
    tags: [String],

    created_at: {type: Date},
    updated_at: {type: Date},
    //admin: { type: Boolean, default: false }
});


PersonSchema.post('init', function (person) {

    person.fullName = person.firstName + ' ' + person.lastName;

    //console.log('in post(init)');

    //next();
});


// on every save, add the date
PersonSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


//PersonSchema.methods.fullName = function () {
//
//    return this.firstName + ' ' + this.lastName;
//
//};

module.exports = mongoose.model('Person', PersonSchema);