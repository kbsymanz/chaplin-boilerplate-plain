define([
  'chaplin',
  'models/search',
  'models/base/collection',
  'underscore'
], function(Chaplin, Search, Collection, _) {
  'use strict';

  var SearchList = Collection.extend({
    model: Search,
    // THIS IS A FAKE for now
    url: 'localhost:3000/searchList',

    initialize: function() {
      SearchList.__super__.initialize.apply(this, arguments);

      this.on('add', this.adding);
    },

    adding: function(model, collection, options) {
      console.log('Adding: %s, Total searches: %d', model.get('term'), collection.length);
    }

  });

  return SearchList;
});
