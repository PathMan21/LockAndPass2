const { ipcRenderer } = require('electron');

ipcRenderer.on('userAdded', (event, user) => {
    const userList = document.getElementById("userList");
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `Utilisateur: ${user.username}`;

    const copyButton = document.createElement("button");
    copyButton.className = "btn btn-primary btn-sm ms-2";
    copyButton.textContent = "Copier";
    copyButton.onclick = () => {
        navigator.clipboard.writeText(user.password);
        alert(`Mot de passe copié pour ${user.username}`);
    };

    li.appendChild(copyButton);
    userList.appendChild(li);
});
