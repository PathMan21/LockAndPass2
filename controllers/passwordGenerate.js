// passwordGenerate.js

const { ipcRenderer } = require('electron');
const bcrypt = require('bcrypt');

function generatePassword() {
    const tableauminuscule = ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "w", "x", "c", "v", "b", "n"];
    const tableaumajuscule = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N"];
    const tableaunumero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const tableausymbole = ["$", "%", "^", "&", "!", "@", "#", ":", ";", "'", ",", ".", ">", "/", "*", "-", "|", "?", "~", "_", "=", "+"];

    let arrayConcatenation = tableauminuscule.concat(tableaumajuscule, tableaunumero, tableausymbole);

    let password = "";

    for (let i = 0; i < 21; i++) {
        let randomIndex = Math.floor(Math.random() * arrayConcatenation.length);
        password += arrayConcatenation[randomIndex];
    }

    document.getElementById("password").value = password;
    document.getElementById("confirm-password").value = password;
    checkPasswordStrength(password)
}


document.getElementById("password").addEventListener("input", function(event) {
  const passwordVerif = event.target.value;
  checkPasswordStrength(passwordVerif);
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function(event) {
  toggleConfirmPassword();
});


document.getElementById("togglePassword").addEventListener("click", function(event) {
  togglePassword();
});

function checkPasswordStrength(passwordVerif) {
  
  const hasLowercase = /[a-z]/.test(passwordVerif);
  const hasUppercase = /[A-Z]/.test(passwordVerif);
  const hasDigit = /[0-9]/.test(passwordVerif);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordVerif);

  if (hasLowercase && hasUppercase && hasDigit && hasSpecial && passwordVerif.length > 12) {
    colorChange("fort");

  } else if ((hasLowercase || hasUppercase) && hasDigit) {
    colorChange("moyen");

  } else if ((hasLowercase || hasSpecial) && hasDigit) {
    colorChange("moyen");
  } else if ((hasLowercase || hasDigit) && passwordVerif.length > 12) {
    colorChange("moyen");
  } else {
    colorChange("faible");
  }

}

function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("togglePassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "Cacher";
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "Voir";
    }
}

function toggleConfirmPassword() {
    const confirmPasswordInput = document.getElementById("confirm-password");
    const toggleButton = document.getElementById("toggleConfirmPassword");

    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        toggleButton.textContent = "Cacher";
    } else {
        confirmPasswordInput.type = "password";
        toggleButton.textContent = "Voir";
    }
}


function colorChange(value) {

  if (value === "faible") {

  document.getElementById("strengthValidator").style.backgroundColor = "#FF4E4E";
  
  } else if (value === "moyen") {
    document.getElementById("strengthValidator").style.backgroundColor = "#FFBF4E";

  } else if (value === "fort") {
    document.getElementById("strengthValidator").style.backgroundColor = "#00DB7C";
  }

}





function addPassword() {
  const { jwtDecode } = require('jwt-decode');

  const token = localStorage.getItem("token");

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);

    const username = decoded.username;

    const userPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    ipcRenderer.send('addPassword', { username, userPassword, confirmPassword });
  } catch (error) {
    console.error('Erreur lors du décodage du token JWT:', error);
  }
}



ipcRenderer.on('addPasswordResponse', (event, response) => {
  if (response.success) {
    const passwords = response.passwords;
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = ''; 

    passwords.forEach(pwd => {
      const li = document.createElement('li');
      li.textContent = pwd.password; 
      passwordList.appendChild(li);
    });
  } else {
    console.error('Erreur lors de l\'ajout de mot de passe :', response.error);
  }
});
