import path from 'path';

import DB from './db';
const DBConfig = DB.DBClient('configurations');

export default {
  notify: (opts) => {
    const config = DBConfig.findAll()[0];

    if (!config.enableDesktopNotification) {
      return true;
    }

    if (Notification.permission === 'granted'){
      var options = {
        title: 'Ooops',
        message: 'Something is wrong'
      };
      Object.assign(options, opts);

      var notification = new Notification(options.title, {
        body: options.message
      });

      if (!!options.onClickURL) {
        notification.onclick = () => {
          require('electron').shell.openExternal(options.onClickURL);
        }
      }
    }
  }
}
