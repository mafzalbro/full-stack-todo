const apiUrl = '/api/notes'; // Adjusted to use relative URL for deployment
let isEditing = false;
let currentNoteId = null;

const title = document.getElementById('title');
const description = document.getElementById('description');
const submitButton = document.getElementById('submitButton');

// Function to check if both fields are non-empty
function checkFields() {
  submitButton.disabled = title.value.trim() === '' || description.value.trim() === '';
}

// Initial check to set the button state based on current field values
checkFields();

// Add event listeners to both fields
title.addEventListener('input', checkFields);
description.addEventListener('input', checkFields);

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();

  document.getElementById('noteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    // const sanitizedTitle = DOMPurify.sanitize(title.value);
    const sanitizedTitle = title.value;
    // const sanitizedDescription = DOMPurify.sanitize(description.value);
    const sanitizedDescription = description.value;

    toggleLoader(true);
    disableForm(true);

    if (isEditing) {
      await updateNote({ title: sanitizedTitle, description: sanitizedDescription });
    } else {
      await addNote({ title: sanitizedTitle, description: sanitizedDescription });
    }

    document.getElementById('noteForm').reset();
    isEditing = false;
    currentNoteId = null;
    loadNotes();

    toggleLoader(false);
    disableForm(false);
    closePopup(); // Close the popup after submission
  });

  // Handle the add note button click
  document.getElementById('addNoteButton').addEventListener('click', () => {
    openPopup();
  });

  // Handle the popup close button click
  document.querySelector('.popup .close').addEventListener('click', () => {
    closePopup();
  });
});

async function loadNotes() {
  toggleLoader(true);

  const response = await fetch(apiUrl);
  const notes = await response.json();
  
  // Sort notes by createdAt in descending order
  notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.description}</p>
      <button onclick="editNote('${note._id}', '${note.title}', '${note.description}')" class="edit"><i class="fas fa-edit"></i></button>
      <button onclick="deleteNote('${note._id}')" class="delete"><i class="fas fa-trash-alt"></i></button>
    `;
    notesList.appendChild(noteElement);
  });

  toggleLoader(false);
  checkFields();
}

async function addNote(note) {
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
  checkFields();
}

async function updateNote(note) {
  await fetch(`${apiUrl}/${currentNoteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
  checkFields();
}

async function deleteNote(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  });
  loadNotes();
  checkFields();
}

function editNote(id, title, description) {
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  isEditing = true;
  currentNoteId = id;
  openPopup(); // Open the popup when editing a note
  checkFields();
}

function toggleLoader(show) {
  const loader = document.getElementById('loader-container');
  loader.style.display = show ? 'flex' : 'none';
  checkFields();
}

function disableForm(disable) {
  title.disabled = disable;
  description.disabled = disable;
  submitButton.disabled = disable;
  checkFields();
}

function openPopup() {
  const popup = document.getElementById('noteFormPopup');
  popup.style.display = 'flex';
}

function closePopup() {
  const popup = document.getElementById('noteFormPopup');
  popup.style.display = 'none';
}


toggleLoader(true)