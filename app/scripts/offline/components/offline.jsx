'use babel';

import React from 'react';

export default class Offline extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <h1 className="title">Build Checker App</h1>
        <br />
        <br />
        <p className="offline-message">Your app is offline</p>
        <img className="offline-icon" src="./assets/images/output.svg" />
      </div>
    )
  }
}
