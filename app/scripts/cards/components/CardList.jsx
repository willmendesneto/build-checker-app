'use babel';

import React from 'react';
import {Component, PropTypes} from 'react';
import CardListItem from './CardListItem';
import {notify} from '../../libraries/notificate';

import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');
const DBConfig = DB.DBClient('configurations');
let config = DBConfig.findAll()[0];

const CardList = React.createClass({

  removeCardListItem(id, itemId, e){
    e.stopPropagation();
    let itemToRemove = this.props.items[id];
    const repoName = itemToRemove.cctrayTrackingURL;
    const removed = DBClient.remove(itemId);
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
        item.interval = config.interval;
        return <CardListItem
                key={item.id}
                id={item.id}
                cctrayTrackingURL={item.cctrayTrackingURL}
                interval={item.interval}
                removeItem={this.removeCardListItem.bind(this, id, item.id)} />;
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
