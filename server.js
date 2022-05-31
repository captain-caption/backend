
'use strict';
require('dotenv').config();const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Transcript = require('./models/transcript-object');

const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_DB_URL;
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
app.get('*', (req, res) => {res.send('This is working');});
app.get('/', (req, res) => {res.status(200).send('Connection ok');});
app.get('/transcript', handleGetTranscript);
app.post('/transcript', handlePostTranscript);
app.delete('/transcript/:id', handleDeleteTranscript);

// To/From Google API
// post - raw text to Google Translate
app.get('/translate', handleTranslationRequest);

//To/From MongoDB
// post - raw text to MongoDB
// put - translated text to MongoDB

async function handleGetTranscript(req, res) {
  await Transcript.find()
    .then(response => res.status(200).send(response))
    .catch(error => { res.status(500).send(error); console.log(error); })
}

async function handlePostTranscript(req, res) {
  const newTranslation = await Transcript.create({ ...req.body })
    .then(response => res.status(200).send(newTranslation))
    .catch(error => { res.status(500).send(error) });
}

async function handleDeleteTranscript(req, res) {
  const { id } = req.params;
  try {
    const trans = await Transcript.findOne({ _id: id });
    if (!trans) res.status(400).send('Unable to delete transcrpipt. Call the FBI');
    else {
      await Transcript.findByIdAndDelete(id);
      res.status(204).send('Bye bye private information');
    }
  } catch (err) {
    res.status(500).send('Internal server error');
  }
}

async function handleTranslationRequest(req, res) {
  const url = process.env.GOOGLE_API_URL;
  const params = {
    q: req.data.q,
    target: req.data.target,
    key: process.env.GOOGLE_API_KEY
  }

  await axios.post(url, { params })
    .then(response => res.status(200).send(response.body.data))
    .catch(error => res.status(500).send(error));
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
