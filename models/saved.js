"use strict";

// app/models/saved.js
// load the things we need
var mongoose = require("mongoose");

// define the schema for our saved model
var savedSchema = mongoose.Schema({
  title: {
    type: String,
    min: [1, "Too few characters"],
    max: 100,
    required: [true, "Please enter a username."]
  },
  description: {
    type: String,
    min: [3, "Please enter an email in the correct format"],
    required: [true, "Please enter an email"]
  }
  articleNote:{
    type: String, 
    min: [1],
    required:[false]
  }
});


// create the model for users and expose it to our app
module.exports = mongoose.model("Saved", savedSchema);
