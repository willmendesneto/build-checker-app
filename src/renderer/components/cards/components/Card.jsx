'use strict';

import React from 'react';
import CardList from './CardList';
import CardStore from '../stores/CardStore';

export default class Card extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { items: [] };
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    this.state = { items: [] };
  }

  loadData() {
    CardStore.getAll().then(function(items) {
      this.setState({
        items: items
      });
    }.bind(this));
  }

  render() {
    return (
        <div>
          <br />
          <br />
          <CardList items={this.state.items} />
        </div>
    )
  }
}
