'use strict';

require('babel-polyfill');

import app from 'app';
import request from 'request';
import BrowserWindow from 'browser-window';
import crashReporter from 'crash-reporter';
import Tray from 'tray';
import Menu from 'menu';
import appMenu from './browser/menu/appMenu';

const pkg = require('../package.json');
const repo = pkg.repository.replace('https://github.com/', '');
const GITHUB_OPTIONS_REQUEST = {
	url: `https://api.github.com/repos/${repo}/releases/latest`,
	method: 'GET',
	headers: {
    'User-Agent': 'node.js'
  }
};

// prevent window being garbage collected
let mainWindow = null;
let appIcon = null;

if( ['dev'].indexOf(process.env.NODE_ENV) >= 0){
	// report crashes to the Electron project
  crashReporter.start({
    productName: 'Build Checker App',
    companyName: 'willmendesneto',
    // submitURL: 'https://your-domain.com/url-to-submit',
    autoSubmit: false
  });

	// adds debug features like hotkeys for triggering dev tools and reload
	require('electron-debug')({
	    showDevTools: true
	});
}

let createMainWindow = (page, options) => {
	var defaultOptions = {
		width: 940,
		height: 600,
		title: 'Build Checker App',
		icon: './src/assets/images/app-icon.png',
		titleBarStyle: 'hidden'
	};
	defaultOptions = Object.assign({}, defaultOptions, options);

	let win = new BrowserWindow(defaultOptions);

	win.loadURL(`file://${__dirname}/renderer/${page}`);
	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});

  if ( ['dev'].indexOf(process.env.NODE_ENV) >= 0 ) {
    win.openDevTools();
	}

	win.setMenu(appMenu);

	return win;

}

app.on('window-all-closed', () => {
	appIcon.destroy();
  app.quit();
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow('index.html');
	}
});


app.on('ready', () => {

	mainWindow = createMainWindow('index.html');

	let sendEventFromPage = (customEventName) => {
		if (!mainWindow.isVisible()) {
			mainWindow.show();
		}
		mainWindow.webContents.send(customEventName);
	};

  appIcon = new Tray('./src/assets/images/app-icon.png');
	appIcon.setToolTip('Build Checker App');

  let contextMenu = Menu.buildFromTemplate([{
		label: 'Open',
		click: () => {
			sendEventFromPage('route:main');
		}
	}, {
		label: 'Configurations',
		click: () => {
			sendEventFromPage('route:configurations');
		}
	}, {
		type: 'separator'
	}, {
		label: 'Check for updates...',
		click: () => {
			request(GITHUB_OPTIONS_REQUEST, (error, response, body) => {
	  		if (error) {
	  			console.log(error);
					return;
	  		}
				if (pkg.version ===  body.tag_name) {
					console.log('You already using the latest version: ' + body.tag_name);
				} else {
					console.log('You are using an oldest version', body);
				}
			});
		}
	}, {
		label: 'About',
		click: () => {
			mainWindow.webContents.send('route:about');
		}
	}, {
		label: 'Quit',
		click: () => {
			appIcon.destroy();
			app.quit();
		}
	}]);
  appIcon.setContextMenu(contextMenu);
	appIcon.on('click', () => {
		if (!mainWindow.isVisible()) {
			mainWindow.webContents.send('route:main');
			mainWindow.show()
		} else {
			mainWindow.hide();
		}
	});

});

process.on('uncaughtException', function() {
  console.log('\n\nUNCAUGHT ERROR\n');
  console.log("caught from process");
});
