const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve static files from 'dist' directory

// Check if MONGODB_URI is set
console.log('MongoDB URI:', process.env.MONGODB_URI);

// MongoDB connection setup
const url = process.env.MONGODB_URI;

if (!url) {
  console.error('Error: MONGODB_URI is not defined.');
  process.exit(1); // Exit the process with an error code
}

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

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

// Route to serve a simple HTML page
app.get('/', (request, response) => {
  console.log('GET /');
  response.send('<h1>Hello World!</h1>');
});

// Route to get all notes
app.get('/api/notes', (request, response) => {
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
app.post('/api/notes', (request, response) => {
  const body = request.body;
  console.log('POST /api/notes', body);

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
app.get('/api/notes/:id', (request, response) => {
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
app.delete('/api/notes/:id', (request, response) => {
  console.log(`DELETE /api/notes/${request.params.id}`);
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting note:', error.message);
      response.status(500).json({ error: 'malformatted id' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = Note;
