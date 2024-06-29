const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Get all notes
router.get('/notes', async (req, res) => {
  // console.log(Object.keys(req));
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get a note by ID
router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).send('Note not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a new note
router.post('/notes', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const existingNote = await Note.findOne({ title });
  if (existingNote && existingNote._id.toString() !== req.params.id) {
    return res.status(400).json({ message: 'A note with this title already exists' });
  }


  try {
    const newNote = new Note({
      title,
      description,
    });

    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err) {
    console.error('Error creating new note:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a note by ID
router.put('/notes/:id', async (req, res) => {
  const { title, description } = req.body;

  try {
    // Check if a note with the same title already exists
    const existingNote = await Note.findOne({ title });
    if (existingNote && existingNote._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'A note with this title already exists' });
    } else {
 
      // Update the note
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { title, description },
        { new: true }
      );
      
      if (!updatedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }      
      return res.status(200).json({ message: 'Note updated successfully', updatedNote });
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// Delete a note by ID
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    } else return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
