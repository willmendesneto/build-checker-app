import path from 'path';

export default {
  notify: (opts) => {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
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

      if (options.onClick && typeof options.onClick === 'function') {
        notification.onclick = options.onClick
      }
    }
  }
}
