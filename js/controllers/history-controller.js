define([
  'chaplin',
  'lib/utils',
  'controllers/base/controller-with-fortunes',
  'views/historyDetail-view'
], function(Chaplin, Utils, Controller, HistoryDetailView) {
  'use strict';

  var HistoryController = Controller.extend({

    show: function(params) {
      var model
        , sl = Chaplin.mediator.searchList
        ;

      model = sl.get(params.id);
      this.view = new HistoryDetailView({
        model: model
        , region: 'search-section'
      });
    }
  });

  return HistoryController;
});

