// passwordGenerate.js

const { ipcRenderer } = require('electron');
const bcrypt = require('bcrypt');

function generatePassword() {
    const tableauminuscule = ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "w", "x", "c", "v", "b", "n"];
    const tableaumajuscule = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N"];
    const tableaunumero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const tableausymbole = ["$", "%", "^", "&", "!", "@", "#", ":", ";", "'", ",", ".", ">", "/", "*", "-", "|", "?", "~", "_", "=", "+"];

    // Concaténer tous les tableaux dans un seul tableau
    let arrayConcatenation = tableauminuscule.concat(tableaumajuscule, tableaunumero, tableausymbole);

    let password = "";

    // Générer un mot de passe de 21 caractères
    for (let i = 0; i < 21; i++) {
        let randomIndex = Math.floor(Math.random() * arrayConcatenation.length);
        password += arrayConcatenation[randomIndex];
    }

    document.getElementById("password").value = password;
    document.getElementById("confirm-password").value = password;
}

function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("togglePassword");

    // Toggle password visibility
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

    // Toggle confirm password visibility
    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        toggleButton.textContent = "Cacher";
    } else {
        confirmPasswordInput.type = "password";
        toggleButton.textContent = "Voir";
    }
}

// Fonction pour ajouter un utilisateur
function addUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
  
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Erreur de hashage du mot de passe:", err);
        return;
      }
  
      // Envoyer les données à main process
      ipcRenderer.send('userRegister', { username, password: hashedPassword });
    });
  }
  
  // Soumission du formulaire pour ajouter un utilisateur
  document.getElementById("addUserForm").addEventListener("submit", function(event) {
    event.preventDefault();
    addUser();
  });
  
  // Écouter la réponse du processus principal
  ipcRenderer.on('userRegisterResponse', (event, response) => {
    if (response.success) {
      // Utilisateur ajouté avec succès, afficher dans la liste
      const userList = document.getElementById("userList");
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `Utilisateur: ${response.username}`;
  
      const copyButton = document.createElement("button");
      copyButton.className = "btn btn-primary btn-sm ms-2";
      copyButton.textContent = "Copier";
      copyButton.onclick = () => {
        navigator.clipboard.writeText(response.password);
        alert(`Mot de passe copié pour ${response.username}`);
      };
  
      li.appendChild(copyButton);
      userList.appendChild(li);
    } else {
      alert("Erreur lors de l'ajout de l'utilisateur: " + response.error);
    }
  });