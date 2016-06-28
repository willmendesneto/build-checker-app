'use babel';

import app from 'app';
import Menu from 'menu';
const CONFIG = require('./../../renderer/components/helpers/config');

const template = [{
  label: 'BuildChecker App',
  submenu: [
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => app.quit()
    },
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
  ]
}];

if (CONFIG.isDev()) {
  template[0].submenu.push({
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  });

  template[0].submenu.push({
    label: 'Toggle Developer Tools',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I';
      }
      return 'Ctrl+Shift+I';
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  });
}

const appMenu = Menu.buildFromTemplate(template);

module.exports = appMenu;
