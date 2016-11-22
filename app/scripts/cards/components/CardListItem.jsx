import React from 'react';
import { Link } from 'react-router';
import request from 'request';
import UrlHelper from '../../helpers/UrlHelper';
import RepositoryDataMapper from '../../helpers/repository-data-mapper';
import path from 'path';
import {notify} from '../../libraries/notificate';
import CONFIG from '../../constants/AppConstants';

const execute = require('controlled-schedule');
const milisecondsToSeconds = (time) => time / 1000;

let resetFailObject = () => {
  return {
    name: null,
    lastBuildLabel: null,
    lastBuildStatus: null
  };
};
let longPolling = true;
let schedule = null;

const schedulerHasBeingexecuted = () => longPolling;

const CardListItem = React.createClass({
  getInitialState() {
    return {
      isTheFirstRequest: true,
      item: {
        name: null,
        webUrl: null,
        lastBuildLabel: null,
        lastBuildTime: null,
        lastBuildStatus: null,
        buildIcon : null,
        class: null
      },
      failObject: resetFailObject()
    };
  },

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.item.class !== nextState.item.class && schedulerHasBeingexecuted();
  },

  componentWillUnmount() {
    schedule.stop();
  },

  startCIChecker() {
    let repository = this.props;
    return new Promise((resolve, reject) => {

      if (!schedulerHasBeingexecuted()) {
        return reject('Polling was stopped!');
      }

      request(repository.cctrayTrackingURL, (error, response, body) => {
        if (error) {
          return reject(error);
        }

        if (response.statusCode === 404) {
          notify({
            title: 'Build Checker',
            message: `Somethink is wrong with your CI URL: ${repository.cctrayTrackingURL}`
          });

          return reject('Error in CI/CD response');
        }

        const data = RepositoryDataMapper.parse(body);
        return resolve(data);
      });
    });
  },

  onSuccess(data) {
    let failObject = this.state.failObject;
    if ( failObject.name !== null ) {
      failObject = resetFailObject();
      notify({
        title: 'Build Checker OK!',
        message: `Now CI of "${data.name}" project is OK. ${data.webUrl}`
      });
    }

    return failObject;

  },

  onError(data) {
    let failObject = this.state.failObject;

    if ( failObject.name !== data.name && failObject.lastBuildLabel !== data.lastBuildLabel) {
      failObject.name = data.name;
      failObject.lastBuildLabel = data.lastBuildLabel;

      notify({
        title: 'Build Checker Failed',
        message: `Somethink is wrong with your CI =(. Fix it!!!! ${data.webUrl}`
      });
    }
    return failObject;
  },

  onError(data) {
    let failObject = this.state.failObject;

    const responseHasDifferentName = failObject.name !== data.name;
    const responseHasDifferentLastBuildLabel = failObject.lastBuildLabel !== data.lastBuildLabel;
    const currentBuildIsFailing = CONFIG.BUILD_STATUS_FAILURE === data.lastBuildStatus;

    if ( responseHasDifferentName && responseHasDifferentLastBuildLabel && currentBuildIsFailing) {
      failObject.name = data.name;
      failObject.lastBuildLabel = data.lastBuildLabel;
      failObject.lastBuildStatus = data.lastBuildStatus;

      notify({
        title: 'Build Checker OK!',
        message: `Somethink is wrong with your CI =(. Fix it!!!! ${data.webUrl}`
      });
    }
    return failObject;
  },

  startCICheckerScheduler() {

    schedule = execute(this.startCIChecker)
      .every(`${milisecondsToSeconds(this.props.interval)}s`);
    schedule
    .on('stop', (data) => {
      console.log('stopped!');
      longPolling = false;
    })
    .on('error', (err) => {
      console.log(`Error: `, err);
      const failObject = resetFailObject();
      const webUrlName = this.props.cctrayTrackingURL.split('?')[0];

      this.setState({
        item: {
          name: webUrlName,
          webUrl: webUrlName,
          lastBuildLabel: null,
          lastBuildTime: null,
          lastBuildStatus: null,
          buildIcon : CONFIG.ERROR_ICON,
          class: CONFIG.CARD_ERROR_CLASS
        },
        isTheFirstRequest: false,
        failObject
      });
    })
    .on('success', (data) => {
      if (schedulerHasBeingexecuted()) {
        let failObject = {};
        const isAnBuildSuccessResponse = data.lastBuildStatus === CONFIG.BUILD_STATUS_SUCCESS;
        if (isAnBuildSuccessResponse) {
          failObject = this.onSuccess(data);
        } else {
          failObject = this.onError(data);
        }

        this.setState({
          item: data,
          isTheFirstRequest: false,
          failObject
        });
      }
    });
    schedule.start();
  },

  componentWillMount() {
    longPolling = true;
    this.startCICheckerScheduler();
  },

  handlerClick(e) {
    e.stopPropagation();
    const URL = this.state.item.webUrl;
    require('electron').shell.openExternal(URL);
  },

  render() {
    const loadingClass = this.state.isTheFirstRequest ? 'loading' : '';
    const buildCardClass = 'build-card ' + loadingClass + ' ' + (this.state.item.class || '');

    return (
      <div className={buildCardClass} key={this.props.id} id={this.props.id} >
        <div className="build-card-remove-wrapper">
          <a className="build-card-remove" onClick={this.props.removeItem} value={this.props.id}>✖</a>
        </div>
        <h2 className={loadingClass}>{this.state.item.name}</h2>
        <p>
          <span className="build-icon">{this.state.item.buildIcon}</span>
          <span className="build-url" onClick={this.handlerClick}>
            <span className="build-label">#{this.state.item.lastBuildLabel}</span>
          </span>
        </p>
      </div>
    );
  }
});


export default CardListItem;
