'use strict';

import React from 'react';
import {Component, PropTypes} from 'react';
import CardListItem from './CardListItem';

const CardList = React.createClass({
  render() {

    let CardListItems = this.props.items.length > 0 ? this.props.items.map(function(item) {
      return <CardListItem key={item.id} id={item.id}
                       name={item.name}
                       cctrayTrackingURL={item.cctrayTrackingURL}
                       interval={item.interval} />;
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
