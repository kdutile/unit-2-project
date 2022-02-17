const mongoose = require('mongoose');
const Meal = require('./mealSchema.js')

const daySchema = new mongoose.Schema({
  date: { type: String, required: true, unique:true},
  lunch: Meal.schema,
  dinner: Meal.schema,
  prepared: [Meal.schema]
});

const Day = mongoose.model('Day', daySchema);

module.exports = Day;
