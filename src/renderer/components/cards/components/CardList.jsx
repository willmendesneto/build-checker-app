'use babel';

import React from 'react';
import {Component, PropTypes} from 'react';
import CardListItem from './CardListItem';
import { notify } from '../../libraries/notify';

import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');

const CardList = React.createClass({

  removeCardListItem(id, e){
    e.stopPropagation();
    const itemToRemove = this.props.items[id];
    const repoName = itemToRemove.name || itemToRemove.cctrayTrackingURL;
    const removed = DBClient.remove(id + 1);
    let message = '';
    if (removed) {
      this.props.items.splice(id, 1);
      this.forceUpdate();
      message = `The repository "${repoName}" was removed  =)`;
    } else {
      message = `Sorry. The repository "${repoName}" wasn't removed removed =/`;
    }

    notify({
      title: 'Remove Build Checker Item',
      subtitle: message
    });
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
      }.bind(this)) : 'Please add a repository in "Configurations" option';

    return (
      <div className="build-card-content">
        {CardListItems}
      </div>
    )
  }
});


// });
export default CardList;
