//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// Schema & initial seed
const Meal = require('./models/mealSchema.js')
const mealSeed = require('./models/someMeals.js')

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
// //localhost:3000
// app.get('/' , (req, res) => {
//   res.send('Hello World!');
// });

// // seed the db
// app.get('/meals/seed', (req, res) => {
//   Meal.create(mealSeed, (err, data) => {
//     res.redirect('/meals');
//   });
// });


//GET
//___________________

//list of all meals
app.get('/meals' , (req, res) => {
  Meal.find({}, (err, allMeals) => {
    res.render('index.ejs', {allMeals});
  })
});

//new meal
app.get('/meals/new' , (req, res) => {
  res.render('new.ejs');
});

//view meal (probably won't use)
app.get('/meals/:id' , (req, res) => {
  Meal.findById(req.params.id, (err, foundMeal) => {
    res.render('show.ejs', {meal:foundMeal});
  });
});

//edit meal
app.get('/meals/:id/edit' , (req, res) => {
  Meal.findById(req.params.id, (err, foundMeal) => {
    res.render('edit.ejs', {meal:foundMeal});
  });
});

//POST
//___________________

//create meal
app.post('/meals' , (req, res) => {
  if (req.body.img === '') {
    req.body.img = 'https://i.imgur.com/YajXMEa.png';
  };
  Meal.create(req.body, (err, createdMeal) => {
    res.redirect('/meals');
  });
});

//PUT
//___________________

//update meal
app.put('/meals/:id' , (req, res) => {
  if (req.body.img === '') {
    req.body.img = 'https://i.imgur.com/YajXMEa.png';
  };
  Meal.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, editedMeal) => {
    res.redirect('/meals');
  });
});

//DELETE
//___________________

//delete meal
app.delete('/meals/:id', (req, res) => {
  // find meal by _id and delete
  Meal.findByIdAndRemove(req.params.id, (err, removeMeal) => {
    res.redirect('/meals');
  });
});



//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
