const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const swal = require('sweetalert'); // Import correct
let passwords;

const jwt = require('jsonwebtoken');
require('dotenv').config();
const dbUrl = 'mongodb://localhost:27017/LockAndPass';
let mainWindow;


function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.whenReady().then(createWindow);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mongoose.connection.close(() => {
      app.quit();
    });
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

ipcMain.on('userRegister', async (event, userData) => {
  try {
    const { username, password, mail } = userData;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      event.reply('userRegisterResponse', { success: false, error: 'Username already exists' });
      return;
    }

    const newUser = new User({ username, password, mail });
    await newUser.save();

    event.reply('userRegisterResponse', { success: true, username });

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  } catch (error) {
    event.reply('userRegisterResponse', { success: false, error: error.message });
  }
});

ipcMain.on('userLogin', async (event, userData) => {
  try {
    const { username, password } = userData;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);
      event.reply('userLoginResponse', { success: true, token });
    } else {
      event.reply('userLoginResponse', { success: false, error: 'Votre identifiant ou votre mot de passe est invalide' });
    }
  } catch (error) {
    event.reply('userLoginResponse', { success: false, error: error.message });
  }
});


function authenticateToken(event, token, next) {
  if (!token) {
    event.reply('errorResponse', { success: false, error: 'Unauthorized' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      event.reply('errorResponse', { success: false, error: 'Forbidden' });
      return;
    }
    event.user = user;
    next();
  });
}
ipcMain.on('addPassword', async (event, { username, userPassword }) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error(`Utilisateur avec le username '${username}' non trouvé`);
    }

    user.passwords.push({ password: userPassword });
    await user.save();

    const passwords = user.passwords.map(pwd => ({ password: pwd.password }));

    // Debugging
    console.log('Mots de passe ajoutés :', passwords);

    event.reply('addPasswordResponse', { success: true, passwords });
  } catch (error) {
    event.reply('addPasswordResponse', { success: false, error: error.message });
  }
});
