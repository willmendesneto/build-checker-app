'use babel';

export default {
  ENV: (process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'),
  ERROR_ICON:'✖',
  SUCCESS_ICON:'✔',
  CARD_SUCCESS_CLASS: 'success',
  CARD_ERROR_CLASS: 'error',
  BUILD_STATUS_SUCCESS: 'Success'
};
