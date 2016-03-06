'use babel';

import fs from 'fs';

let DB = null;

let getDB = () => {

  if (DB !== null) {
    return DB;
  }

  DB = require('../../../data/db.json');

  return DB;
}

const getDBClient = (key) => {
  let database = getDB();
  if (!database[key]) {
    return false;
  }

  const keyExistInDB = (key) => {
    return !!DB[key];
  }

  const insert = (valueToAppend) => {
    if (!keyExistInDB(key)) {
      return false;
    }
    valueToAppend.id = DB[key].length + 1;
    valueToAppend.interval = 30000;
    DB[key].push(valueToAppend);
    fs.writeFileSync(`${__dirname}/../../../data/db.json`, JSON.stringify(DB), 'utf-8');
    return true;
  }

  const update = (valueToUpdate) => {
    if (!keyExistInDB(key)) {
      return false;
    }
    var valueWasUpdated = false;
    DB[key] = DB[key].map((element) => {
      if ( element.id === item.id){
        element = valueToUpdate;
        valueWasUpdated = true;
      }
      return element;
    });
    if (valueWasUpdated) {
      fs.writeFileSync(`${__dirname}/../../../data/db.json`, JSON.stringify(DB), 'utf-8');
    }

    return valueWasUpdated;
  }


  const remove = (id) => {
    if (!keyExistInDB(key)) {
      return false;
    }

    let lengthBeforeDelete = DB[key].length;
    DB[key] = DB[key].filter((element, pos) => {
      return element.id !== id;
    });
    fs.writeFileSync(`${__dirname}/../../../data/db.json`, JSON.stringify(DB), 'utf-8');

    return DB[key].length === lengthBeforeDelete - 1;
  }

  const findAll = () => {
    if (!DB[key]) {
      return [];
    }
    return DB[key];
  }
  return {
    findAll: findAll,
    insert: insert,
    update: update,
    remove: remove
  };
}

export default {
  DBClient: getDBClient
};
