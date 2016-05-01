let DB = null;
const low = require('lowdb');
const storage = require('lowdb/browser');


let getDB = () => {

  if (DB !== null) {
    return DB;
  }
  DB = low('db', { storage });
  return DB;
}

const getDBClient = (key) => {
  let database = getDB();
  if (!database(key)) {
    return false;
  }

  const keyExistInDB = (key) => {
    let database = getDB();
    return database(key).size() > 0;
  }

  const insert = (valueToAppend) => {
    const database = DB(key).cloneDeep();
    const maxId = database.reduce((firstItem, secondItem) => {
      return firstItem.id > secondItem.id ? firstItem.id : secondItem.id;
    }, 0);
    valueToAppend.id = maxId + 1;

    DB(key).push(valueToAppend);
    DB.write();
    return true;
  }

  const update = (valueToUpdate) => {
    var valueWasUpdated = false;
    let database = DB(key).cloneDeep();
    let updatedDB = [];

    database.forEach(element => {
      if ( element.id === valueToUpdate.id){
        element = valueToUpdate;
        valueWasUpdated = true;
      }
      updatedDB.push(element);
    });

    DB.object[key] = updatedDB;
    if (valueWasUpdated) {
      DB.write();
    }

    return valueWasUpdated;
  }

  const remove = (id) => {
    if (!keyExistInDB(key)) {
      return false;
    }

    let database = DB(key).cloneDeep();
    let lengthBeforeDelete = DB(key).size();

    DB.object[key] = database.filter((element, pos) => {
      return element.id !== id;
    });
    DB.write();
    return DB(key).size() === lengthBeforeDelete - 1;
  }

  const findAll = () => {
    if (!keyExistInDB(key)) {
      return [];
    }
    return DB(key).cloneDeep();
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
