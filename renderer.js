const { ipcRenderer } = require('electron');
const bcrypt = require('bcrypt');

function registerUser() {
  let username = document.getElementById('login').value;
  let password = document.getElementById('password').value;
  let mail = document.getElementById('Mail').value;

  // Hacher le mot de passe avant de l'envoyer à MongoDB
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
    ipcRenderer.send('userRegister', { username, password: hashedPassword, mail });
  });
}

ipcRenderer.on('userRegisterResponse', (event, response) => {
  if (response.success) {
    alert('Utilisateur enregistré avec succès !');
    // Rediriger vers la page de connexion après l'enregistrement réussi
    window.location.href = '../index.html';
  } else {
    alert('Erreur lors de l\'enregistrement : ' + response.error);
  }
});

function loginUser(event) {
  event.preventDefault();

  let username = document.getElementById('login').value;
  let password = document.getElementById('password').value;

  ipcRenderer.send('userLogin', { username, password });
}

ipcRenderer.on('userLoginResponse', (event, response) => {
  if (response.success) {
    alert('Connexion réussie !');
    // Rediriger vers la page centrale après la connexion réussie
    window.location.href = './components/Central.html';
  } else {
    alert('Erreur lors de la connexion : ' + response.error);
  }
});
