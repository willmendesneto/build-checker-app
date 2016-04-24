'use babel';

import React from 'react';
import CardList from './CardList';
import CardStore from '../stores/CardStore';

export default class Card extends React.Component {
  render() {
    return (
        <div>
          <h1 className="title">Build Checker App</h1>
          <br />
          <br />
          <CardList />
        </div>
    )
  }
}
