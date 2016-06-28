'use babel';

export default {
  ENV: (process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'),
  PENDING_ICON: '•••',
  ERROR_ICON: '✖',
  SUCCESS_ICON: '✔',
  CARD_SUCCESS_CLASS: 'success',
  CARD_ERROR_CLASS: 'error',
  CARD_PENDING_CLASS: 'pending',
  CARD_UNKNOWN_CLASS: 'unknown',
  BUILD_STATUS_SUCCESS: 'Success',
  BUILD_STATUS_FAILURE: 'Failure',
  BUILD_STATUS_PENDING: 'Pending',
  BUILD_STATUS_EXCEPTION: 'Exception',
  BUILD_STATUS_UNKNOWN: 'Unknown'
};
