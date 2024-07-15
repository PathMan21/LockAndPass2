const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const dbUrl = 'mongodb://localhost:27017/LockAndPass';

const User = require('./models/user'); // Assurez-vous de créer ce modèle

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
      slashes: true
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

ipcMain.on('userRegister', async (event, userData) => {
  try {
    const { username, mail, password } = userData;
    const existingUser = await Password.findOne({ username });
    
    if (existingUser) {
      event.reply('userRegisterResponse', { success: false, error: 'Username already exists' });
    } else {
      const newPassword = new Password({ username, mail, password });
      await newPassword.save();
      event.reply('userRegisterResponse', { success: true, username });
    }
  } catch (error) {
    event.reply('userRegisterResponse', { success: false, error: error.message });
  }
});

ipcMain.on('userLogin', async (event, userData) => {
  try {
    const { username, password } = userData;
    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
      event.reply('userLoginResponse', { success: true });
    } else {
      event.reply('userLoginResponse', { success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    event.reply('userLoginResponse', { success: false, error: error.message });
  }
});


