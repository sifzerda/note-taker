const express = require('express');
const fs = require('fs');
const path = require('path');
//const api = require('./public/assets/js/index.js');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Import custom middleware, "body parser"
app.use(bodyParser.json());

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/api', api);

app.use(express.static('public'));

// =========================== API Routes ======================================= //

// GET Route for homepage ===============//
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html')));

// GET route for notes ==================//
app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, './public/notes.html')));

// GET all notes ========================//
app.get('/api/notes', (req, res) => {
  try {
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Unable to get saved notes', error });
  }
});

// GET Route for a specific note ========================//
app.get('/api/notes/:id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});


// POST a new note =======================//
app.post('/api/notes', (req, res) => {
  try {
    const { title, content } = req.body;
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const newNote = { id: notes.length + 1, title, content };
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.status(201).json({ message: 'Note created', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'There was an error creating a note', error });
  }
});

// DELETE note by id ======================//
app.delete('/api/notes/:id', async (req, res) => {
  const noteId = parseInt(req.params.id);
  try {
    let notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      fs.writeFileSync('./db/db.json', JSON.stringify(notes));
      res.json(`Note has been deleted 🗑️`);
    } else {
      res.status(404).json({ message: 'Unable to find note' });
    }
  } catch (error) {
    res.status(500).json({ message: 'There was an error deleting the note', error });
  }
});
 

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`
  ));
