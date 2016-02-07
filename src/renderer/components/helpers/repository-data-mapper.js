'use babel';

import $ from 'jquery';
import CONFIG from '../constants/AppConstants';

let RepositoryDataMapper = {
  parse: (data) => {
    let xml = $($.parseXML(data));
    return xml.find('Projects').map(function(){
      let el = $(this).find('Project');
      let lastBuildStatus = el.attr('lastBuildStatus');
      return {
        name: el.attr('name'),
        webUrl: el.attr('webUrl'),
        lastBuildLabel: el.attr('lastBuildLabel'),
        lastBuildTime: el.attr('lastBuildTime'),
        lastBuildStatus: lastBuildStatus,
        buildIcon : (lastBuildStatus === CONFIG.BUILD_STATUS_SUCCESS ? CONFIG.SUCCESS_ICON : CONFIG.ERROR_ICON),
        class: lastBuildStatus === CONFIG.BUILD_STATUS_SUCCESS ? CONFIG.CARD_SUCCESS_CLASS : CONFIG.CARD_ERROR_CLASS
      };
    })[0];
  }
};

export default RepositoryDataMapper;
