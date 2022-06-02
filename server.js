'use strict';

/* --------------------------------- GLOBALS --------------------------------- */

require('dotenv').config();
const axios = require('axios');
const Transcript = require('./models/transcript-object');
const verifyUser = require('./auth');

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL);

const PORT = process.env.PORT || 3002;

/* --------------------------------- ROUTES --------------------------------- */

// To/From Client
app.get('/transcript', handleGetTranscript);
app.post('/transcript', handlePostTranscript);
app.delete('/transcript/:id', handleDeleteTranscript);

// To/From Google API
app.post('/translate', handleTranslationRequest);

/* -------------------------------- HANDLERS -------------------------------- */

// GET - Transcript Objects
async function handleGetTranscript(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      await Transcript.find()
        .then((response) => res.status(200).send(response))
        .catch((error) => res.status(500).send(error));
    }
  });
}
// POST (Create) - Transcript Object
async function handlePostTranscript(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        const newTranscript = await Transcript.create({
          username: `${req.body.username}`,
          timestamp: `${new Date()}`,
          raw_text: `${req.body.raw_text}`,
        });
        res.send(newTranscript);
      } catch (err) {
        res.status(500).send('Internal Server error');
      }
    }
  });
}
// DELETE - Transcript Object
async function handleDeleteTranscript(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      const { id } = req.params;
      try {
        const trans = await Transcript.findOne({ _id: id });
        if (!trans)
          res.status(400).send('Unable to delete transcript. Call the FBI');
        else {
          await Transcript.findByIdAndDelete(id);
          res.status(204).send('Bye bye private information');
        }
      } catch (err) {
        res.status(500).send('Internal server error');
      }
    }
  });
}
// POST (Translate and Create) - Transcript Object
async function handleTranslationRequest(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      let url = `${process.env.GOOGLE_API_URL}?key=${
        process.env.GOOGLE_API_KEY
      }&q=${encodeURIComponent(req.body.raw_text)}&target=${encodeURIComponent(
        req.body.code
      )}`;
      try {
        let response = await axios.post(url);
        let transcriptObject = await Transcript.create({
          username: `${req.body.username}`,
          timestamp: `${new Date()}`,
          raw_text: `${req.body.raw_text}`,
          translated_text: `${response.data.data.translations[0].translatedText}`,
        });
        console.log(response.data.data.translations[0].translatedText);
        res.status(200).send(transcriptObject);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  });
}
/* ---------------------------- CATCH-ALL ROUTES ---------------------------- */

app.get('/', (req, res) => {
  res.status(200).send('SUCCESS: Designate route (/transcript, /translate)');
});
app.get('*', (req, res) => {
  res.status(200).send('SUCCESS');
});

/* -------------------------------- LISTENER -------------------------------- */

app.listen(PORT, () => console.log(`listening on ${PORT}`));
