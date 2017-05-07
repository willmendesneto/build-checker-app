'use babel';

import Promise from 'bluebird';
import AppConstants from '../../constants/AppConstants';
import { get, Deferred } from 'jquery';
import DB from '../../libraries/db';
const DBClient = DB.DBClient('repositories');

const getAll = () => {
  return new Promise(resolve => resolve(DBClient.findAll()));
};

const CardStore = {
  getAll,
  findById: findByIdMock
};

const findByIdMock = (cardId) => {
  if (!AppConstants.GH_PAGES) {
    return get(`${AppConstants.CARDS_URL}/${cardId}`);
  }

  const dfd = Deferred();
  get(AppConstants.CARDS_URL).then((data) => {
    const firstCard = data.filter(item => parseInt(item.id, 10) === parseInt(cardId, 10));
    dfd.resolve(firstCard[0]);
  });
  return dfd.promise();
};

export default CardStore;
