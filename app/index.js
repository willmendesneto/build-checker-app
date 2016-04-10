import React from 'react';
import ReactDOM from 'react-dom';
import ipc from 'ipc-renderer';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history'
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

import Card from './scripts/cards/components/Card';
import Configuration from './scripts/configurations/components/configuration';
import About from './scripts/about/components/about';

import {notify} from './scripts/libraries/notificate';

import './app.global.css';

window.onload = function(){
  setTimeout(function(){
    var node = document.getElementById('load-content');
    node.style.display = 'block';
    var opacity = 10;
    function frame() {
      opacity -= 1;
      node.style.opacity = '.' + opacity;
      if (opacity === 1) {
        node.style.opacity = opacity;
        clearInterval(id);
        node.parentNode.removeChild(node);
        ReactDOM.render(
          <Router history={appHistory} >
            <Route path="/" name="cards" component={Card}/>
            <Route path="/configurations" name="configurations" component={Configuration} />
            <Route path="/about" name="about" component={About} />
            <Route path="*" component={Card}/>
          </Router>,
          document.getElementById('app')
        );
      }
    }
    var id = setInterval(frame, 100);
  }, 800);
}

ipc.on('route:configurations', function(){
  appHistory.push('/configurations');
});

ipc.on('route:main', function(){
  appHistory.push('/');
});

ipc.on('route:about', function(){
  appHistory.push('/about');
});

ipc.on('app:sendMessage', function(e, eventResponse){
  notify(eventResponse);
});
