const apiUrl = 'http://localhost:3000/api/notes';
let isEditing = false;
let currentNoteId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();

  document.getElementById('noteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (isEditing) {
      await updateNote({ title, description });
    } else {
      await addNote({ title, description });
    }

    document.getElementById('noteForm').reset();
    isEditing = false;
    currentNoteId = null;
    loadNotes();
  });
});

async function loadNotes() {
  const response = await fetch(apiUrl);
  const notes = await response.json();
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.description}</p>
      <button onclick="editNote('${note._id}', '${note.title}', '${note.description}')">Edit</button>
      <button onclick="deleteNote('${note._id}')">Delete</button>
    `;
    notesList.appendChild(noteElement);
  });
}

async function addNote(note) {
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
}

async function updateNote(note) {
  await fetch(`${apiUrl}/${currentNoteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
}

async function deleteNote(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  });
  loadNotes();
}

function editNote(id, title, encodedDescription) {
    const description = decodeURIComponent(encodedDescription.replace(/\+/g, ' '));
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    isEditing = true;
    currentNoteId = id;
  }