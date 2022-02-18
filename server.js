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

// Schemas & initial seeds
const Meal = require('./models/mealSchema.js')
const Day = require('./models/daySchema.js')
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
  });
});

//list of all days
app.get('/days' , (req, res) => {
  Day.find({}).populate('lunch').populate('dinner').populate('prepared').exec((err, allDays) => {
    res.render('days/index.ejs', {allDays});
  });
});

//new meal
app.get('/meals/new' , (req, res) => {
  res.render('new.ejs');
});

//new day (, it's a new life for me)
app.get('/days/new' , (req, res) => {
  Meal.find({}, (err, allMeals) => {
    res.render('days/new.ejs', {allMeals});
  });
});

//view meal (probably won't use)
app.get('/meals/:id' , (req, res) => {
  Meal.findById(req.params.id, (err, foundMeal) => {
    res.render('show.ejs', {meal:foundMeal});
  });
});

//view day (want this to be my only visible page for customer)
app.get('/days/:id' , (req, res) => {
  Day.findById(req.params.id).populate('lunch').populate('dinner').populate('prepared').exec((err, foundDay) => {
    res.render('days/show.ejs', {day:foundDay});
  });
});

//edit meal
app.get('/meals/:id/edit' , (req, res) => {
  Meal.findById(req.params.id, (err, foundMeal) => {
    res.render('edit.ejs', {meal:foundMeal});
  });
});

//edit day
app.get('/days/:id/edit' , (req, res) => {
  Day.findById(req.params.id).populate('lunch').populate('dinner').populate('prepared').exec((err, foundDay) => {
    Meal.find({}, (err, allMeals) => {
      res.render('days/edit.ejs',
      {
        day:foundDay,
        allMeals:allMeals
      });
    });
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

//create day
app.post('/days' , (req, res) => {
  Day.create(req.body, (err, createdDay) => {
    res.redirect('/days');
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

//update day
app.put('/days/:id' , (req, res) => {
  Day.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, editedDay) => {
    res.redirect('/days');
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

//delete meal
app.delete('/days/:id', (req, res) => {
  // find meal by _id and delete
  Day.findByIdAndRemove(req.params.id, (err, removeDay) => {
    res.redirect('/days');
  });
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
