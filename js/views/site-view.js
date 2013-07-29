define(['views/base/view', 'text!templates/site-view.hbs'], function(View, template) {
  'use strict';

  var SiteView = View.extend({
    container: 'body',
    id: 'site-container',
    regions: {
      '#history-container': 'history-section',
      '#search-container': 'search-section',
      '#random-container': 'random-section'
    },
    template: template
  });

  return SiteView;
});
