const { ipcRenderer } = require('electron');
const bcrypt = require('bcrypt');
const swal = require('sweetalert'); // Import correct


async function registerUser() {
  const username = document.getElementById('login').value;
  const mail = document.getElementById('Mail').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('passwordConfirm').value;

  if (password !== confirmPassword) {
    swal("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    ipcRenderer.send('userRegister', { username, password: hashedPassword, mail });
  } catch (error) {
    console.error('Error hashing password:', error);
    swal('Erreur lors de l\'enregistrement : ' + error.message);
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
    swal('Connexion réussie ! Redirection vers la page centrale.');
    window.location.href = './components/Central.html';
  } else {
    swal('Erreur lors de la connexion : ' + response.error);
  }
});

