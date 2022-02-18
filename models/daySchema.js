const mongoose = require('mongoose');
const Meal = require('./mealSchema.js')

const daySchema = new mongoose.Schema({
  date: { type: String, required: true, unique:true},
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal'},
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal'},
  prepared: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal'}]
});

const Day = mongoose.model('Day', daySchema);

module.exports = Day;
