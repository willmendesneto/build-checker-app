'use babel';

const isGhPages = window.location.origin.indexOf('github.io') !== -1;

export default {
  GH_PAGES: isGhPages,
  ERROR_ICON:'✖',
  SUCCESS_ICON:'✔',
  CARD_SUCCESS_CLASS: 'success',
  CARD_ERROR_CLASS: 'error',
  BUILD_STATUS_SUCCESS: 'Success',
  CARDS_URL: isGhPages ? 'http://willmendesneto.github.io/generator-reactor/db.json' : 'http://localhost:3000/cards'
};
