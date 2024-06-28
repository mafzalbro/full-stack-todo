const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Get all notes
router.get('/notes', async (req, res) => {
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
  try {
    const newNote = new Note({
      title: req.body.title,
      description: req.body.description,
    });
    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update a note by ID
router.put('/notes/:id', async (req, res) => {
  const { title, description } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, description }, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note updated successfully', updatedNote });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// Delete a note by ID
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'note not found' });
    } else return res.status(200).json({ message: 'note deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;