'use babel';

import React from 'react';

import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');


const FORM_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  INVALID: 'INVALID',
  ADDED: 'ADDED'
};

var Configuration = React.createClass({
  getInitialState: function() {
    return {cctrayTrackingURL: '', formState: FORM_STATES.NOT_STARTED};
  },

  handleCCTrayTrackingURLChange: function(e) {
    if (e.target.value !== this.state.cctrayTrackingURL) {
      this.setState({cctrayTrackingURL: e.target.value});
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var cctrayTrackingURL = this.state.cctrayTrackingURL.trim();
    if (!cctrayTrackingURL) {
      this.setState({formState: FORM_STATES.INVALID});
      return;
    }
    var inserted = DBClient.insert({cctrayTrackingURL: cctrayTrackingURL});
    if (inserted) {
      this.setState({cctrayTrackingURL: '', formState: FORM_STATES.ADDED});
    } else {
      this.setState({formState: FORM_STATES.INVALID});
      setTimeout(function() {
        this.setState({formState: FORM_STATES.NOT_STARTED});
      }.bind(this), 2000);
    }
  },

  render: function() {

    var message  = '';
    if (this.state.formState === FORM_STATES.ADDED) {
      message = <div className="notify-success"> ✔ Repository information added</div>;
    } else if (this.state.formState === FORM_STATES.INVALID) {
      message = <div className="notify-error"> ✖ All the fields are required</div>;
    }

    return (
      <div>
        <h1>Build Checker App</h1>
        { message }
        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend className="title">Configurations</legend>

            <label htmlFor="cctrayTrackingURL">CCTray Repo URL</label>
            <input id="cctrayTrackingURL" type="text"
            className="pure-input-1"
            placeholder="Repository name"
            value={this.state.cctrayTrackingURL}
            onChange={this.handleCCTrayTrackingURLChange} />

            <button type="submit" className="button-xlarge pure-button pure-button-primary">ADD</button>
          </fieldset>
        </form>
      </div>
    );
  }
});


export default Configuration;
