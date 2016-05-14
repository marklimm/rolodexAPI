var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//  4/10 - I started templating this out, then decided to implement CRUD operations (including INSERT) for the person before working on this

var LogEntrySchema = new Schema({
    text: String,
    associatedPerson: ObjectId,

    created_at: {type: Date},
    //updated_at: {type: Date},
    //admin: { type: Boolean, default: false }
});


LogEntrySchema.post('init', function (person) {

    //person.fullName = person.firstName + ' ' + person.lastName;

    //console.log('in post(init)');

    //next();
});


// on every save, add the date
LogEntrySchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    //this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


//LogEntrySchema.methods.fullName = function () {
//
//    return this.firstName + ' ' + this.lastName;
//
//};

module.exports = mongoose.model('LogEntry', LogEntrySchema);