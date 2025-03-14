import express from 'express';
import mongoose from 'mongoose';
import { Note } from './models/Note';
import { NotFoundError, ValidationError } from './errors';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb+srv://oyiohachinedujude:qFs6vZ9N4Byp0akt@cluster0.v1baz.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// POST endpoint to add a note
app.post('/api/notes', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) throw new ValidationError('Title and content are required');
    const newNote = new Note({ title, content });
    await newNote.save();
    console.log('New note saved:', newNote); 
    res.status(201).json(newNote);
  } catch (err) {
    console.error('Error saving note:', err);
    next(err);
  }
});

//Root Route
app.get('/', (req, res) => {
  res.send(`<h1>Welcome to the Note-Taking API!</h1> <p>If you want to view note kindly use this url: <a>https://note-taking-api-4hf6.onrender.com/api/notes</a></p>`);
});

// GET endpoint to fetch all notes
app.get('/api/notes', async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// GET endpoint to fetch a single note by ID
app.get('/api/notes/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) throw new NotFoundError('Note not found');
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// DELETE endpoint to delete a note by ID
app.delete('/api/notes/:id', async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) throw new NotFoundError('Note not found');
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
});


// PUT endpoint to update a note by ID
app.put('/api/notes/:id', async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      throw new ValidationError('At least one field (title or content) is required for update');
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      throw new NotFoundError('Note not found');
    }

    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  } else if (err instanceof ValidationError) {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});