'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import ipc from 'ipc-renderer';

import Card from './components/cards/components/Card';
import Configuration from './components/configurations/components/configuration';
import About from './components/about/components/about';


window.onload = function(){

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


ipc.on('route:configurations', function(){
  browserHistory.push('/configurations');
});

ipc.on('route:main', function(){
  browserHistory.push('/');
});

ipc.on('route:about', function(){
  console.log('CHEGOU!');
  browserHistory.push('/about');
});
