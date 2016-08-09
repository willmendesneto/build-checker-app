'use babel';

import React from 'react';

export default class About extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <h1 className="title">Build Checker App</h1>
        <br />
        <br />
        <p>Version: 0.0.10</p>
      </div>
    )
  }
}
