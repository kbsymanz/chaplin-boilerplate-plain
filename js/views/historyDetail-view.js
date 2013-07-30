define([
  'chaplin',
  'views/base/view',
  'text!templates/historyDetail-section.hbs',
  'jquery',
], function(Chaplin, View, template, $) {
  'use strict';

  var HistoryDetailView = View.extend({
    // Automatically render after initialize
    autoRender: true,

    className: 'search',

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,

    initialize: function(options) {
      HistoryDetailView.__super__.initialize.apply(this, arguments);

      // --------------------------------------------------------
      // Shortcuts.
      // --------------------------------------------------------
      this._searchResultsSel = '#search_results';

      this.render();
    },

    // --------------------------------------------------------
    // Display the searching and the results as appropriate.
    // --------------------------------------------------------
    render: function() {
      var results
        ;
      HistoryDetailView.__super__.render.apply(this);

      $(this._searchResultsSel).removeClass('hidden');
    }
  });

  return HistoryDetailView;
});


