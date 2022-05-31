'use strict';
const mongoose = require('mongoose');
const {Schema} = mongoose;

const transcript = new Schema({
  username: String,
  timestamp: Date,
  raw_text: String,
  translated_text: String
});

const Transcript = mongoose.model('Transcript', transcriptSchema);

module.exports = Transcript;
