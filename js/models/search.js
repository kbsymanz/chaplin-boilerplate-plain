define([
  'chaplin',
  'lib/utils',
  'models/base/model'
], function(Chaplin, Utils, Model) {
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

      this.on('change:term', this.doSearch);
    },

    // --------------------------------------------------------
    // Send the search term on to the server and handle the
    // results.
    // --------------------------------------------------------
    doSearch: function(model, value, options) {
      var opts = {}
        ;
      model.set('searchTime', Date.now());
      opts.term = value;
      model.unset('results');
      model.set('isSearching', true);
      setTimeout(function() {
        Chaplin.mediator.publish('search', opts, function(err, data) {
          model.set('isSearching', false);
          if (err) return Utils.debug(err);
          model.set('results', lf2br(data));
        });
      }, serverDelay);
    }

  });

  return Search;
});
