'use strict';

const electron = require('electron');
const express = require('express');
const tail = require('./main/tail');

// Module to control application life.
const app = electron.app;
const server = express();

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

	// Listener event on file
	tail.init();
	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

server.get('/', function (req, res) {
	console.log('Server OK');
	const data = {
		status: 200,
		date: Date.now()
	};
	res.setHeader('Content-Type', 'application/json');
	// ipc.send('asynchronous-message', 'ping');
	if (mainWindow) {
		mainWindow.webContents.send('asynchronous-message', data);
	}
	res.send(JSON.stringify(data));
});

server.listen(8080);
