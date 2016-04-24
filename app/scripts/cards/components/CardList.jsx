'use babel';

import React from 'react';
import {Component, PropTypes} from 'react';
import CardListItem from './CardListItem';
import CardStore from '../stores/CardStore';
import {notify} from '../../libraries/notificate';

import DB from '../../libraries/db';
const DBClient = DB.DBClient('repositories');
const DBConfig = DB.DBClient('configurations');
let config = DBConfig.findAll()[0];

const CardList = React.createClass({

  getInitialState() {
    return {
      items: []
    };
  },

  removeCardListItem(id, itemId, e){
    e.stopPropagation();
    const itemToRemove = this.state.items.filter(item => item.id === itemId)[0];
    const repoName = itemToRemove.cctrayTrackingURL;
    const removed = DBClient.remove(itemId);
    let message = '';
    let titleComplement = '';
    if (removed) {
      this.loadData();
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
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    CardStore.getAll().then(function(items) {
      this.setState({
        items: items
      });
    }.bind(this));
  },

  render() {
    let CardListItems = this.state.items.length > 0 ?
      this.state.items.map(function(item, id) {
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
