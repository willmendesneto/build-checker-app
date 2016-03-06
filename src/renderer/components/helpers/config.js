'use babel';

const ENVIRONMENT = require('./../../../env');

let CONFIG = {
  isDev: () => {
    return ENVIRONMENT.ENV === 'DEVELOPMENT';
  }
};

export default CONFIG;
