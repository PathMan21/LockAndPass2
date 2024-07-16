const { ipcRenderer } = require('electron');
const bcrypt = require('bcrypt');

async function registerUser() {
  const username = document.getElementById('login').value;
  const mail = document.getElementById('Mail').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('passwordConfirm').value;

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    ipcRenderer.send('userRegister', { username, password: hashedPassword, mail });
  } catch (error) {
    console.error('Error hashing password:', error);
    alert('Erreur lors de l\'enregistrement : ' + error.message);
  }
}

function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById('login').value;
  const password = document.getElementById('password').value;

  ipcRenderer.send('userLogin', { username, password });
}

ipcRenderer.on('userLoginResponse', (event, response) => {
  if (response.success) {
    localStorage.setItem('token', response.token);
    alert('Connexion réussie ! Redirection vers la page centrale.');
    window.location.href = './components/Central.html';
  } else {
    alert('Erreur lors de la connexion : ' + response.error);
  }
});

ipcRenderer.on('addPasswordResponse', (event, response) => {
  if (response.success) {
    const passwords = response.passwords;
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = ''; // Efface la liste actuelle

    passwords.forEach(pwd => {
      const li = document.createElement('li');
      li.textContent = pwd.password; // Assurez-vous que "password" correspond à la structure de vos mots de passe
      passwordList.appendChild(li);
    });
  } else {
    console.error('Erreur lors de l\'ajout de mot de passe :', response.error);
  }
});
