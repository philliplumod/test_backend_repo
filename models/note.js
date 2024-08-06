// note.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Define the note schema and model
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = mongoose.model('Note', noteSchema);

// Route to get all notes
router.get('/api/notes', (request, response) => {
  console.log('GET /api/notes');
  Note.find({})
    .then(notes => {
      response.json(notes);
    })
    .catch(error => {
      console.error('Error fetching notes:', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// Route to create a new note
router.post('/api/notes', (request, response) => {
  const body = request.body;
  
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save()
    .then(savedNote => {
      response.json(savedNote);
    })
    .catch(error => {
      console.error('Error saving note:', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// Route to get a specific note by ID
router.get('/api/notes/:id', (request, response) => {
  console.log(`GET /api/notes/${request.params.id}`);
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.error('Error fetching note by ID:', error.message);
      response.status(500).json({ error: 'malformatted id' });
    });
});

// Route to delete a note by ID
router.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting note:', error.message);
      response.status(500).json({ error: 'malformatted id' });
    });
});

router.put('/api/notes/:id', (request, response) => {
    const body = request.body

    const note = {
      content: body.content,
      important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = router;
