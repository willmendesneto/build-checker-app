import React from 'react';
import { Link } from 'react-router';
import request from 'request';
import UrlHelper from '../../helpers/UrlHelper';
import RepositoryDataMapper from '../../helpers/repository-data-mapper';
import ChannelRequest from '../../libraries/channel-request';
import path from 'path';
import {notify} from '../../libraries/notificate';
import CONFIG from '../../constants/AppConstants';

const UNEXPECTED_BUILD_STATUSES = [
  CONFIG.BUILD_STATUS_FAILURE
];

let resetFailObject = () => {
  return {
    name: null,
    lastBuildLabel: null
  };
};
let channelRequest = null;

let failObject = resetFailObject();
let loadDataWasCalled = false;

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
    return this.state.item.lastBuildLabel !== nextState.item.lastBuildLabel;
  },

  componentWillUnmount() {
    channelRequest.stopLongPolling = true;
  },

  componentDidMount() {
    let repository = this.props;
    let self = this;

    channelRequest = new ChannelRequest(repository.cctrayTrackingURL, (channelName, next) => {

      request(repository.cctrayTrackingURL, (error, response, body) => {

        if (error) {
          return next(error);
        }
        let failObject = this.state.failObject;

        const data = RepositoryDataMapper.parse(body);
        let nextReturn = null;

        if( UNEXPECTED_BUILD_STATUSES.indexOf(data.lastBuildStatus) === -1  ) {
          if ( failObject.name !== null ) {
            failObject = resetFailObject();
            notify({
              title: 'Build Checker OK!',
              message: 'Now CI of "' + data.name + '" project is OK. ' + data.webUrl
            });
          }
        } else {

          if ( failObject.name !== data.name && failObject.lastBuildLabel !== data.lastBuildLabel) {
            failObject.name = data.name;
            failObject.lastBuildLabel = data.lastBuildLabel;

            notify({
              title: 'Build Checker Failed',
              message: 'Somethink is wrong with your CI =(. Fix it!!!! ' + data.webUrl
            });
          }
          nextReturn = 'Somethink is wrong with your CI =(. Fix it!!!!';
        }

        self.setState({
          item: data,
          isTheFirstRequest: false,
          failObject: failObject
        });

        return next(nextReturn);
      });
    });
    channelRequest.startLongPolling(repository.interval);
  },

  handlerClick(e) {
    e.stopPropagation();
    const URL = this.state.item.webUrl;
    require('electron').shell.openExternal(URL);
  },

  render() {
    const loadingClass = this.state.isTheFirstRequest ? 'loading' : '';
    const buildCardClass = 'build-card ' + loadingClass + ' ' + this.state.item.class;

    return (
      <div className={buildCardClass} key={this.props.id} id={this.props.id} >
        <a className="build-card-remove" onClick={this.props.removeItem} value={this.props.id}>✖</a>
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
