define([
  'views/base/collection-view',
  'views/random-view',
  'text!templates/random-section.hbs'
], function(CollectionView, RandomView, template) {
  'use strict';

  var RandomListView = CollectionView.extend({
    // Automatically render after initialize
    autoRender: true,

    itemView: RandomView,

    listSelector: 'div.random-list ul',

    className: 'random-list',

    // Automatically append to the DOM on render
    region: 'random-list',

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,

    initialize: function(options) {
      RandomListView.__super__.initialize.apply(this, arguments);

    }
  });

  return RandomListView;
});

