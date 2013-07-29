define([
  'chaplin',
  'models/search',
  'models/base/collection',
  'underscore',
  'backbone.localStorage'
], function(Chaplin, Search, Collection, _, LocalStorage) {
  'use strict';

  var maxHistory = 20;

  var SearchList = Collection.extend({
    model: Search,

    localStorage: new LocalStorage('SearchList'),

    initialize: function() {
      var self = this;
      SearchList.__super__.initialize.apply(this, arguments);

      this.on('add', this.adding);

      // --------------------------------------------------------
      // Load any prior searches from localStorage in case this
      // page was refreshed, etc.
      // --------------------------------------------------------
      _.each(this.localStorage.findAll(), function(m) {
        self.add(m, [{add: false}]);
      });
    },

    adding: function(model, collection, options) {
      // --------------------------------------------------------
      // Add into localStorage.
      // --------------------------------------------------------
      this.localStorage.create(model);

      // --------------------------------------------------------
      // Limit the number of records that we retain.
      // --------------------------------------------------------
      while (this.length > maxHistory) {
        this.localStorage.destroy(this.pop());
      }
    },

    // --------------------------------------------------------
    // Sort in descending order by creation time.
    // --------------------------------------------------------
    comparator: function(model1, model2) {
      var st1 = model1.get('searchTime')
        , st2 = model2.get('searchTime')
        ;
      if (st1 < st2) return 1;
      if (st1 > st2) return -1;
      return 0;
    }

  });

  return SearchList;
});
