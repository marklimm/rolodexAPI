var express = require('express');
var router = express.Router();


const Authentication = require('../controllers/authenticationController')

const passportService = require('../services/passportStrategies')
const passport = require('passport')


var Person     = require('../models/person');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({ message: 'hooray! welcome to my Person API!' });
});




//  authenticate with passport using the JWT strategy, and when they are authenticated don't create a cookie-based session (which is what passport does by default)

//  requireAuth = JWT, verifying a token
const requireAuth = passport.authenticate('jwt', { session: false })

//  signin = passport local strategy (reading in email/password)
const requireSignIn = passport.authenticate('local', { session: false })



router.post('/signup', Authentication.signup)
router.post('/signin', requireSignIn, Authentication.signin)



router.route('/people')

    .all(requireAuth)

    //.all(requireAuth)

    // create a person (accessed at POST http://localhost:8080/api/people)
    .post(function(req, res) {

        var person = new Person();      // create a new instance of the Person model


        person.firstName = req.body.firstName;
        person.lastName = req.body.lastName;
        person.description = req.body.description;
        person.tags = req.body.tags;

        // save the person and check for errors
        person.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Person created!' });
        });

    })


    // get all the people (accessed at GET http://localhost:8080/api/people)
    .get(function(req, res, next){

        console.log('inside of get but before get')
        next();

    }, function(req, res) {
        Person.find(function(err, people) {
            //Person.find({}, function(err, people) {
            if (err)
                res.send(err);

            res.json(people);
        });
    });



// on routes that end in /people/:person_id
// ----------------------------------------------------
router.route('/people/:person_id')

    // get the person with that id (accessed at GET http://localhost:8080/api/people/:person_id)
    .get(function(req, res) {
        Person.findById(req.params.person_id, function(err, person) {
            //Person.find({ username: 'starlord55' }, function(err, person) {
            if (err)
                res.send(err);


            //console.log("dudified version: " + person.dudify());
            res.json(person);
        });
    })


    // update the person with this id (accessed at PUT http://localhost:8080/api/people/:person_id)
    .put(function(req, res) {

        // use our person model to find the person we want
        Person.findById(req.params.person_id, function(err, person) {

            if (err)
                res.send(err);

            person.firstName = req.body.firstName;
            person.lastName = req.body.lastName;
            person.description = req.body.description;
            person.tags = req.body.tags;

            // save the person
            person.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ success: true });
            });

        });
    })


    // delete the person with this id (accessed at DELETE http://localhost:8080/api/people/:person_id)
    .delete(function(req, res) {
        Person.remove({
            _id: req.params.person_id
        }, function(err, person) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });



module.exports = router;
