const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true},
  img: String,
  description: String,
  allergies: [String]
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
