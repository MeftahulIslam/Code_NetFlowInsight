//for login and signup page password fields
function toggle_password_visibility(input_id) {
    var input = document.getElementById(input_id);
    var toggleCheckbox = document.getElementById(input_id + "-toggle");
    if (input.type === "password") {
        input.type = "text";
        toggleCheckbox.checked = true;
    } else {
        input.type = "password";
        toggleCheckbox.checked = false;
    }
}

// send an AJAX request to the Flask backend, handled by delete_note()
function deleteNote(note_id){
    fetch('/delete_note', {
        method: 'POST',
        body: JSON.stringify({note_id: note_id}),
    }).then((_res) => {
        window.location.href = "/view_notes";
    });
    
}


function editNote(noteID) {
    const listItem = document.querySelector(`[data-note-id='${noteID}']`);
    const noteDisplay = listItem.querySelector('.note-display');
    const noteEditField = listItem.querySelector('.note-edit-field');
    const editNoteInput = listItem.querySelector('.edit-note-input');

    editNoteInput.value = noteDisplay.textContent;

    noteDisplay.style.display = 'none';
    noteEditField.style.display = 'block';
  }

  function saveEditedNote(noteID) {
    const listItem = document.querySelector(`[data-note-id='${noteID}']`);
    const noteDisplay = listItem.querySelector('.note-display');
    const noteEditField = listItem.querySelector('.note-edit-field');
    const editNoteInput = listItem.querySelector('.edit-note-input');

    noteDisplay.textContent = editNoteInput.value;

    noteDisplay.style.display = 'inline';
    noteEditField.style.display = 'none';

    const url = '/update_notes';
    const editedNote = editNoteInput.value;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note: editedNote, note_id: noteID }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from Flask:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  function editApiKey() {
    const apiKeyDisplay = document.getElementById('apiKeyDisplay');
    const apiKeyEditField = document.getElementById('apiKeyEditField');
    const editApiKeyInput = document.getElementById('editApiKeyInput');

    // display the current API key value in the edit field
    editApiKeyInput.value = apiKeyDisplay.textContent;

    // show the edit field and hide the display span
    apiKeyDisplay.style.display = 'none';
    apiKeyEditField.style.display = 'block';
  }

  // function to save the edited API key
  function saveEditedApiKey() {
    const apiKeyDisplay = document.getElementById('apiKeyDisplay');
    const apiKeyEditField = document.getElementById('apiKeyEditField');
    const editApiKeyInput = document.getElementById('editApiKeyInput');

    // update the displayed API key with the edited value
    apiKeyDisplay.textContent = editApiKeyInput.value;

    // show the display span and hide the edit field
    apiKeyDisplay.style.display = 'inline';
    apiKeyEditField.style.display = 'none';

    const url = '/update_api_key';

    // get the edited API key value
    const editedApiKey = editApiKeyInput.value;

    // send an AJAX request to the Flask backend, handled by update_api_key()
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: editedApiKey }),
    })
      .then(response => response.json())
      .then(data => {
        // not implemented yet
        console.log('Response from Flask:', data);
      })
      .catch(error => {
        // not implemented yet 
        console.error('Error:', error);
      });
  }
