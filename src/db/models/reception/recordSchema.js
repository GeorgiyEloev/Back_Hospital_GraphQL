const mongoose = require("mongoose");

const { Schema } = mongoose;

const recordSchema = new Schema({
  userId: String,
  patient: String,
  doctor: String,
  date: { type: Date },
  symptoms: String,
});

module.exports = Record = mongoose.model("records", recordSchema);
