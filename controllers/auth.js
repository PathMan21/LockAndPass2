// renderer.js

const { ipcRenderer } = require('electron');

function registerUser() {

  let username = document.getElementById('login').value;
  let password = document.getElementById('password').value;
  let mail = document.getElementById('Mail').value;
  console.log("hello");
  ipcRenderer.send('userRegistered', { username, password, mail });
}

ipcRenderer.on('userRegistered', (event, response) => {
  if (response.success) {
    alert('Utilisateur enregistré avec succès !');
  } else {
    alert('Erreur lors de l\'enregistrement : ' + response.error);
  }
});
