'use strict';

import React from 'react';

import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');

var Configuration = React.createClass({
  getInitialState: function() {
    return {name: '', cctrayTrackingURL: ''};
  },

  handleNameChange: function(e) {
    if (e.target.value !== this.state.name) {
      this.setState({name: e.target.value});
    }
  },

  handleCCTrayTrackingURLChange: function(e) {
    if (e.target.value !== this.state.cctrayTrackingURL) {
      this.setState({cctrayTrackingURL: e.target.value});
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var cctrayTrackingURL = this.state.cctrayTrackingURL.trim();
    if (!cctrayTrackingURL || !name) {
      return;
    }
    DBClient.insert({name: name, cctrayTrackingURL: cctrayTrackingURL});
    this.setState({name: '', cctrayTrackingURL: ''});
  },

  render: function() {
    return (
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Configurations</legend>

          <label htmlFor="name">Repository name</label>
          <input id="name" type="text"
          placeholder="Repository name"
          value={this.state.name}
          onChange={this.handleNameChange} />

          <label htmlFor="cctrayTrackingURL">CCTray Repo URL</label>
          <input id="cctrayTrackingURL" type="text"
          placeholder="Repository name"
          value={this.state.cctrayTrackingURL}
          onChange={this.handleCCTrayTrackingURLChange} />

          <button type="submit" className="button-xlarge pure-button pure-button-primary">ADD</button>
        </fieldset>
      </form>
    );
  }
});


export default Configuration;
