define([
  'chaplin',
  'views/base/collection-view',
  'views/history-view',
  'text!templates/history-section.hbs'
], function(Chaplin, CollectionView, HistoryView, template) {
  'use strict';

  var HistoryListView = CollectionView.extend({
    // Automatically render after initialize
    autoRender: true,

    itemView: HistoryView,

    listSelector: 'div.history-section ul',

    className: 'history-section',

    // Automatically append to the DOM on render
    region: 'history-section',

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,

    initialize: function(options) {
      HistoryListView.__super__.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'add', this.render);
    }

  });

  return HistoryListView;
});


