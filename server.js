
'use strict';
require('dotenv').config();const express = require('express');
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const Transcript = require('./models/transcript-object');

const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_DB_URL;
mongoose.connect(url);

// routes

// To/From Client

app.get('/transcript', handleGetTranscript);
app.post('/transcript', handlePostTranscript);
app.delete('/transcript/:id', handleDeleteTranscript);

// To/From Google API
app.get('/translate', handleTranslationRequest);

async function handleGetTranscript(req, res) {
  await Transcript.find()
    .then(response => res.status(200).send(response))
    .catch(error => { res.status(500).send(error); console.log(error); });
}

async function handlePostTranscript(req, res) {
  console.log(req);
  let reqObj = {};
  if (req.query) {
    reqObj = {...req.query}
  } else {
    reqObj = {...req}
  }
  console.log(reqObj);
  try {
    const newTranslation = await Transcript.create(reqObj);
    res.send(newTranslation);
  } catch (err) {
    res.send('Internal Server error');
  }
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
  let url = `${process.env.GOOGLE_API_URL}?key=${process.env.GOOGLE_API_KEY}&q=${encodeURIComponent(req.query.q)}&target=${encodeURIComponent(req.query.target)}`;
  await axios.post(url)
    .then(response =>  {handlePostTranscript({username: `${req.query.username}`, timestamp: `${new Date()}`, raw_text: `${req.query.q}`, translated_text: `${response.data.data.translations[0].translatedText}`}); res.status(200).send(response.data.data);})
    .catch(error => res.status(500).send(error));
}

app.get('/', (req, res) => {res.status(200).send('Connection ok');});
app.get('*', (req, res) => {res.status(200).send('This is working');});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
