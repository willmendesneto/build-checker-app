'use strict';

import React from 'react';
import { Link } from 'react-router';
import request from 'request';
import UrlHelper from '../../helpers/UrlHelper';
import RepositoryDataMapper from '../../helpers/repository-data-mapper';
import ChannelRequest from '../../libraries/channel-request';
import notifier from 'node-notifier';
import path from 'path';

/**
 * Show OS level notification using node-notifier
 */
let notify = (options) => {
    let notifyOptions = {
      sound: 'Bottle',
      contentImage: '../../../../assets/images/app-icon.png',
      icon: '../../../../assets/images/app-icon.png',
      title: options.title,
      subtitle: options.subtitle,
      message: options.message
    };
    notifier.notify(notifyOptions);
}

let resetFailObject = () => {
  return {
    name: null,
    lastBuildLabel: null
  };
};
let channelRequest = null;

let failObject = resetFailObject();
let loadDataWasCalled = false;
let CardListItem = React.createClass({
  getInitialState() {
    return {
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

    channelRequest = new ChannelRequest(repository.name, (channelName, next) => {

      request(repository.cctrayTrackingURL, (error, response, body) => {
        if (error) {
          return next(error);
        }
        let failObject = this.state.failObject;

        const data = RepositoryDataMapper.parse(body);
        let nextReturn = null;

        if( data.lastBuildStatus === 'Success' ) {
          if ( failObject.name !== null ) {
            failObject = resetFailObject();
            notify({
              title: 'Build Checker OK!',
              subtitle: 'Now CI of "' + data.name + '" project is OK',
              contentImage: '../../../../assets/images/build-success.ico',
              icon: '../../../../assets/images/build-success.ico',
              message: data.webUrl
            });
          }
        } else {

          if ( failObject.name !== data.name && failObject.lastBuildLabel !== data.lastBuildLabel) {
            failObject.name = data.name;
            failObject.lastBuildLabel = data.lastBuildLabel;

            notify({
              title: 'Build Checker Failed',
              subtitle: 'Somethink is wrong with your CI =(. Fix it!!!!',
              contentImage: '../../../../assets/images/build-error.png',
              icon: '../../../../assets/images/build-error.png',
              message: data.webUrl
            });
          }
          nextReturn = 'Somethink is wrong with your CI =(. Fix it!!!!';
        }

        self.setState({
          item: data,
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
    let buildCardClass = 'build-card ' + this.state.item.class;
    return (
      <div className={buildCardClass} key={this.props.id} id={this.props.id} >
        <h2>{this.state.item.name}</h2>
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
