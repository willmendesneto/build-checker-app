'use babel';

import app from 'app';
import Menu from 'menu';
import MenuItem from 'menu-item';

let template = [{
  label: 'Electron App',
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

let appMenu = Menu.buildFromTemplate(template);

export default appMenu;
