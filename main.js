/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const electron = require('electron');
const request = require('request');
const fs = require('fs');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
const Tray = electron.Tray;
const CONFIG = require('./app/scripts/helpers/config');

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({
    showDevTools: true
  });
}

let template = [{
  label: 'BuildChecker App',
  submenu: [{
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {app.quit()},
    },
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]
}];

if (CONFIG.isDev()) {

  template[0].submenu.push({
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function(item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.reload();
    }
  });

  template[0].submenu.push({
    label: 'Toggle Developer Tools',
    accelerator: (function() {
      if (process.platform == 'darwin')
        return 'Alt+Command+I';
      else
        return 'Ctrl+Shift+I';
    })(),
    click: function(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  });
}

const appMenu = Menu.buildFromTemplate(template);

// prevent window being garbage collected
let mainWindow = null;
let appIcon = null;

let pkg = require('./package.json');
let repo = pkg.repository.replace('https://github.com/', '');
let GITHUB_OPTIONS_REQUEST = {
	url: `https://api.github.com/repos/${repo}/releases/latest`,
	method: 'GET',
	headers: {
    'User-Agent': 'node.js'
  }
};

let createMainWindow = (page, options) => {
	var defaultOptions = {
		width: 940,
		height: 600,
		title: 'Build Checker App',
		icon: './app/assets/images/app-icon.png',
		titleBarStyle: 'hidden'
	};
	defaultOptions = Object.assign({}, defaultOptions, options);

	let win = new BrowserWindow(defaultOptions);

	win.loadURL(`file://${__dirname}/${page}`);
	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});

  if ( ['dev'].indexOf(process.env.NODE_ENV) >= 0 ) {
    win.openDevTools();
	}

	return win;

}

app.commandLine.appendSwitch('disable-renderer-backgrounding');

app.on('ready', () => {
	mainWindow = createMainWindow('app/app.html');

	Menu.setApplicationMenu(appMenu);

  let sendEventFromPage = (customEventName) => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.webContents.send(customEventName);
  };

  appIcon = new Tray(path.join(__dirname, 'app/assets/images/app-icon.png'));
  appIcon.setToolTip('Build Checker App');

  let contextMenu = Menu.buildFromTemplate([{
    label: 'Open',
    click: () => {
      sendEventFromPage('route:main');
    }
  }, {
    label: 'Add repository',
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

app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});

process.on('error', function(err) {
  console.log(err);
});
