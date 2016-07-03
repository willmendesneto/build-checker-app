import React from 'react';
import ReactDOM from 'react-dom';
import ipc from 'ipc-renderer';
import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

import Card from './scripts/cards/components/Card';
import Offline from './scripts/offline/components/offline';
import Configuration from './scripts/configurations/components/configuration';
import Preferences from './scripts/preferences/components/Preferences';
import About from './scripts/about/components/about';

import DB from './scripts/libraries/db';
const DBConfig = DB.DBClient('configurations');
let config = DBConfig.findAll()[0];

if (!config) {
  const DEFAULT_INTERVAL = 30000;
  const defaultConfig = {
    showAppInDock: true,
    enableDesktopNotification: true,
    interval: DEFAULT_INTERVAL
  };
  DBConfig.insert(defaultConfig);
  config = defaultConfig;
}

import { notify } from './scripts/libraries/notificate';
import './app.global.css';

let isOnline = navigator.onLine;

const updateOnlineStatus = () => {
  if (navigator.onLine && !isOnline) {
    appHistory.push('/');

    notify({
      title: 'Build Checker Internet Status',
      message: `We are online again!`
    });

    window.location.reload();

  } else if (!navigator.onLine) {
    appHistory.push('/offline');

    notify({
      title: 'Build Checker Internet Status',
      message: `We are offline!`
    });

  }
  isOnline = navigator.onLine;
};

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline',  updateOnlineStatus);

window.onload = () => {

  updateOnlineStatus();

  setTimeout(() => {
    const node = document.getElementById('load-content');
    node.style.display = 'block';
    let opacity = 10;
    const frame = () => {
      opacity -= 1;
      node.style.opacity = `.${opacity}`;
      if (opacity === 1) {
        node.style.opacity = opacity;
        clearInterval(id);

        node.parentNode.removeChild(node);
        ReactDOM.render(
          <Router history={appHistory} >
            <Route path="/offline" name="offline" component={Offline} />
            <Route path="/" name="cards" component={Card} />
            <Route path="/configurations" name="configurations" component={Configuration} />
            <Route path="/preferences" name="preferences" component={Preferences} />
            <Route path="/about" name="about" component={About} />
            <Route path="*" component={Card} />
          </Router>,
          document.getElementById('app')
        );
      }
    };

    const id = setInterval(frame, 100);
  }, 800);
};

ipc.on('app:updateAppWithConfigInformationsCallback', (event, response) => {
  console.log(response);
});

ipc.send('app:updateAppWithConfigInformations', config);

ipc.on('route:configurations', () => appHistory.push('/configurations'));

ipc.on('route:main', () => {
  appHistory.push('/');
  window.location.reload();
});

ipc.on('route:about', () => appHistory.push('/about'));

ipc.on('route:preferences', () => appHistory.push('/preferences'));

ipc.on('app:sendMessage', (e, eventResponse) => notify(eventResponse));
