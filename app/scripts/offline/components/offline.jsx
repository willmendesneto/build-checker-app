'use babel';

import React from 'react';

const Offline = () => {
  return (
    <div>
      <h1 className="title">Build Checker App</h1>
      <br />
      <br />
      <p className="offline-message">Your app is offline. I will update automatically when the internet is back.</p>
      <img className="offline-icon" src="./assets/images/output.svg" />
    </div>
  );
};

export default Offline;
