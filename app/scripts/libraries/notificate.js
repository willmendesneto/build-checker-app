import DB from './db';
const DBConfig = DB.DBClient('configurations');

const notify = (opts) => {
  const config = DBConfig.findAll()[0];

  if (!config.enableDesktopNotification) {
    return true;
  }

  if (Notification.permission === 'granted') {
    const options = {
      title: 'Ooops',
      message: 'Something is wrong'
    };
    Object.assign(options, opts);

    const notification = new Notification(options.title, {
      body: options.message
    });

    if (!!options.onClickURL) {
      notification.onclick = () => {
        require('electron').shell.openExternal(options.onClickURL);
      };
    }
  }
};

export default {
  notify
};
