'use babel';

import notifier from 'node-notifier';

/**
 * Show OS level notification using node-notifier
 */
module.exports.notify = (options) => {
    let notifyOptions = {
      sound: 'Bottle',
      contentImage: '../../../assets/images/app-icon.png',
      icon: '../../../assets/images/app-icon.png',
      title: options.title || '',
      subtitle: options.subtitle || '',
      message: options.message || ''
    };
    notifier.notify(notifyOptions);
}
