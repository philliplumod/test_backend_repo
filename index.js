const express = require('express')
const app = express()
const cors = require('cors')

// Initial array of notes
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can exescute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
app.use(cors())
app.use(express.static('dist')) // Middleware to parse JSON bodies

// Route to serve a simple HTML page
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Route to get all notes
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// Function to generate a new unique ID for a note
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

// Route to create a new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note) // Add the new note to the notes array

  response.json(note)
})
          
// Route to get a specific note by ID
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Route to delete a note by ID
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id) // Remove the note from the notes array

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
