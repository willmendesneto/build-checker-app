'use babel';

import app from 'app';
import Menu from 'menu';
import MenuItem from 'menu-item';
import fs from 'fs';
import CONFIG from './../../renderer/components/helpers/config';

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
      if (focusedWindow)
        focusedWindow.toggleDevTools();
    }
  });
}

let appMenu = Menu.buildFromTemplate(template);

module.exports = appMenu;
