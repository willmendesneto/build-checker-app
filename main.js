import app from 'app';
import BrowserWindow from 'browser-window';
import request from 'request';
import crashReporter from 'crash-reporter';
import Tray from 'tray';
import Menu from 'menu';
import path from 'path';
const appMenu = require('./src/browser/menu/appMenu');

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
	mainWindow = createMainWindow('index.html');

	Menu.setApplicationMenu(appMenu);

  let sendEventFromPage = (customEventName) => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.webContents.send(customEventName);
  };

  appIcon = new Tray(path.join(__dirname, 'src/assets/images/app-icon.png'));
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
