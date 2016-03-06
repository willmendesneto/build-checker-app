'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import ipc from 'ipc-renderer';

import Card from './components/cards/components/Card';
import Configuration from './components/configurations/components/configuration';
import About from './components/about/components/about';

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
          <Router history={browserHistory} >
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
  browserHistory.push('/configurations');
});

ipc.on('route:main', function(){
  browserHistory.push('/');
});

ipc.on('route:about', function(){
  browserHistory.push('/about');
});
