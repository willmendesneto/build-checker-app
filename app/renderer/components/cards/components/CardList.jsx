'use babel';

import React from 'react';
import {Component, PropTypes} from 'react';
import CardListItem from './CardListItem';
const notifier = require('node-notifier');

/**
 * Show OS level notification using node-notifier
 */
let notify = (options) => {
  options.sound = true;
  notifier.notify(options);
};

import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');

const CardList = React.createClass({

  removeCardListItem(id, e){
    e.stopPropagation();
    const itemToRemove = this.props.items[id];
    const repoName = itemToRemove.name || itemToRemove.cctrayTrackingURL;
    const removed = DBClient.remove(id + 1);
    let message = '';
    let titleComplement = '';
    if (removed) {
      this.props.items.splice(id, 1);
      titleComplement = 'OK';
      message = `The repository "${repoName}" was removed`;
    } else {
      titleComplement = 'Error';
      message = `Sorry. The repository "${repoName}" wasn't removed removed`;
    }

    notify({
      title: 'Remove Build Checker Item: ' + titleComplement,
      message: message
    });
    console.log('removed', message);
    this.forceUpdate();
  },

  render() {
    let CardListItems = this.props.items.length > 0 ?
      this.props.items.map(function(item, id) {
        return <CardListItem
                key={item.id}
                id={item.id}
                name={item.name}
                cctrayTrackingURL={item.cctrayTrackingURL}
                interval={item.interval}
                removeItem={this.removeCardListItem.bind(this, id)} />;
      }.bind(this)) : 'Please add a repository in "Add repository" option';

    return (
      <div className="build-card-content">
        {CardListItems}
      </div>
    )
  }
});


// });
export default CardList;
