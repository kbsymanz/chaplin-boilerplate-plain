define(['views/base/view', 'text!templates/site.hbs'], function(View, template) {
  'use strict';

  var SiteView = View.extend({
    container: 'body',
    id: 'site-container',
    regions: {
      //'#history-container': 'history',
      //'#search-container': 'search',
      '#random-container': 'random-list'
    },
    template: template
  });

  return SiteView;
});
