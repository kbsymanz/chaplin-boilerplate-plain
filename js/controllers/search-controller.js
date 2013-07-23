define([
  'controllers/base/controller-with-fortunes',
  'models/search',
  'views/search-view'
], function(Controller, Search, SearchView) {
  'use strict';

  var SearchController = Controller.extend({
    show: function(params) {
      this.model = new Search();
      this.view = new SearchView({
        model: this.model
        , region: 'search'
      });
    }
  });

  return SearchController;
});

