// connect to google translate API

// connect to mongoDB
const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');
const Transcript = require('./models/transcript-object');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const url ='';
mongoose.connect(url);


/*
Front end, Audio -> WebSpeech API

Client Browser <-  Text, webSpeech API

Client Browser, text -> Backend Server

Backend Server -> Google Translate
               -> MongoDB

Google Translate, translated text -> Backend Server -> Client BRowser
                                                    -> MongoDB
*/
// routes

// To/From Client
// get - transcript object
app.get('*', (req, res) => {
  res.send('This is working');
});
app.get('/', (req, res) => {
  res.status(200).send('Connection ok');
});

app.get('/transcript', handleGetTranscript);
app.post('/transcript', handlePostTranscript);

// To/From Google API
// post - raw text to Google Translate

//To/From MongoDB
// post - raw text to MongoDB
// put - translated text to MongoDB

async function handleGetTranscript(req, res) {
  await Transcript.find()
    .then(response => res.send(response))
    .catch(error => {res.status(500).send(error); console.log(error);})
}

async function handlePostTranscript (req, res) {
  await Transcript.create()
}
