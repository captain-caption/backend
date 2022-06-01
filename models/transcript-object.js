'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const transcriptSchema = new Schema({
  username: { type: String, required: true },
  timestamp: { type: Date, required: true },
  raw_text: { type: String, required: true },
  translated_text: { type: String, required: false },
});

const Transcript = mongoose.model('Transcript', transcriptSchema);

module.exports = Transcript;
