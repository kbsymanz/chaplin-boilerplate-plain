define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var serverDelay = 0  // milliseconds to delay to emulate remote server, 0 to disable
    ;

  // --------------------------------------------------------
  // Change the line feeds into breaks.
  // --------------------------------------------------------
  var lf2br = function(results) {
    return _.map(results, function(rst) {
      return rst.split('\n').join('<br />');
    });
  };

  var Search = Model.extend({
    defaults: {
      isSearching: false
      , term: ''
    },

    initialize: function(attributes, options) {
      Model.prototype.initialize.apply(this, arguments);
      this.set('searchTime', Date.now());

      this.on('change:term', this.doSearch);
    },

    // --------------------------------------------------------
    // Send the search term on to the server and handle the
    // results.
    // --------------------------------------------------------
    doSearch: function(model, value, options) {
      var opts = {}
        ;
      opts.term = value;
      model.unset('results');
      model.set('isSearching', true);
      setTimeout(function() {
        Chaplin.mediator.publish('search', opts, function(data) {
          model.set('results', lf2br(data));
          model.set('isSearching', false);
        });
      }, serverDelay);
    }

  });

  return Search;
});
