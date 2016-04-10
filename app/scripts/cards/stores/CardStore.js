'use babel';

import React from 'react';
import Promise from 'bluebird';
import AppConstants from '../../constants/AppConstants';
import jQuery from 'jquery';
import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');

let CardStore = {
  getAll: () => {
    return new Promise( (resolve) => {
      return resolve(DBClient.findAll());
    });
  },
  findById: findByIdMock
};

let findByIdMock = (cardId) => {
  if (!AppConstants.GH_PAGES) {
    return jQuery.get(AppConstants.CARDS_URL + '/' + cardId);
  }

  var dfd = jQuery.Deferred();
  jQuery.get(AppConstants.CARDS_URL).then((data) => {
    dfd.resolve(data.filter(function(item){
      return parseInt(item.id) === parseInt(cardId);
    })[0]);
  });
  return dfd.promise();
}

export default CardStore;
