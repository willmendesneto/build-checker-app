'use babel';

import React from 'react';
import ipc from 'ipc-renderer';

import DB from '../../libraries/db';
const DBConfig = DB.DBClient('configurations');

const FORM_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  INVALID: 'INVALID',
  ADDED: 'ADDED'
};
const milisecondsToSeconds = (time) => time / 1000
const secondsToMiliseconds = (time) => time * 1000

let config = DBConfig.findAll()[0];

if (!config) {
  const DEFAULT_INTERVAL = 30000;
  const defaultConfig = {
    showAppInDock: true,
    notificationsIsEnabled: true,
    interval: DEFAULT_INTERVAL
  };
  DBConfig.insert(defaultConfig);
  config = defaultConfig;
}

let timeoutId = null;

const Configuration = React.createClass({
  getInitialState() {
    return {
      submitted: false,
      interval: milisecondsToSeconds(config.interval),
      showAppInDock: config.showAppInDock,
      enableDesktopNotification: config.enableDesktopNotification,
      formState: FORM_STATES.NOT_STARTED
    };
  },

  componentWillUnmount() {
    clearTimeout(timeoutId);
  },

  handlePollInterval(e) {
    if (e.target.value !== this.state.interval) {
      this.setState({interval: e.target.value});
    }
  },

  handleEnableDesktopNotification(e) {
    if (e.target.value !== this.state.enableDesktopNotification) {
      this.setState({enableDesktopNotification: e.target.checked});
    }
  },

  handleShowAppInDock(e) {
    if (e.target.value !== this.state.showAppInDock) {
      this.setState({showAppInDock: e.target.checked});
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    this.setState({submitted: true});
    const interval = parseInt(this.state.interval);
    const showAppInDock = !!this.state.showAppInDock;
    const enableDesktopNotification = !!this.state.enableDesktopNotification;
    if (interval <= 0) {
      this.setState({formState: FORM_STATES.INVALID, submitted: false});
      return;
    }

    const updatedConfigurations = {
      interval: secondsToMiliseconds(interval),
      showAppInDock: showAppInDock,
      enableDesktopNotification: enableDesktopNotification,
      id: config.id
    };
    const updated = DBConfig.update(updatedConfigurations);
    const self = this;
    timeoutId = setTimeout(() => {
      if (updated) {
        ipc.send('app:updateAppWithConfigInformations', updatedConfigurations);
        self.setState({formState: FORM_STATES.ADDED, submitted: false});
      } else {
        self.setState({formState: FORM_STATES.INVALID, submitted: false});
      }

      timeoutId = setTimeout(() => {
        self.setState({formState: FORM_STATES.NOT_STARTED});
      }, 3000);
    }, 1000);
  },

  render() {

    let message  = '';
    if (this.state.formState === FORM_STATES.ADDED) {
      message = <div className="notify-success"> ✔ Configuration updated with success. <b>Please restart the app.</b></div>;
    } else if (this.state.formState === FORM_STATES.INVALID) {
      message = <div className="notify-error"> ✖ All the fields are required</div>;
    }

    let className = 'button-xlarge pure-button pure-button-primary';
    if (!!this.state.submitted) {
      className += ' m-progress';
    }

    return (
      <div>
        <h1>Build Checker App</h1>
        { message }
        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend className="title">Preferences</legend>

            <label htmlFor="enableDesktopNotification">Enable Desktop Notifications?</label>
            <input id="enableDesktopNotification"
              type="checkbox"
              checked={this.state.enableDesktopNotification}
              onChange={this.handleEnableDesktopNotification}
              value={this.state.enableDesktopNotification} />

            <label htmlFor="showAppInDock">Show app in dock <i>(just for MacOS users)</i></label>
            <input id="showAppInDock"
              type="checkbox"
              checked={this.state.showAppInDock}
              onChange={this.handleShowAppInDock}
              value={this.state.showAppInDock} />

            <label htmlFor="interval">Poll interval <i>(in seconds)</i></label>
            <input id="interval"
              type="number"
              placeholder="number"
              step="1"
              min="1"
              max="1000"
              pattern="[0-9]*"
              inputMode="numeric"
              value={this.state.interval}
              onChange={this.handlePollInterval} />
            <br/><br/><br/>

            <button type="submit" className={className} disabled={this.state.submitted} >SAVE</button>
          </fieldset>
        </form>
      </div>
    );
  }
});


export default Configuration;
