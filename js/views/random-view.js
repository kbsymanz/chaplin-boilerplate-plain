define([
  'views/base/view',
  'text!templates/random.hbs'
], function(View, template) {
  'use strict';

  var RandomView = View.extend({
    // Automatically render after initialize
    autoRender: true,

    className: 'random',

    tagName: 'li',

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,

    initialize: function(options) {
      RandomView.__super__.initialize.apply(this, arguments);

      // --------------------------------------------------------
      // Respond when the model changes. This occurs when the
      // model is populated from the server and the current
      // fortune is replaced with another.
      // --------------------------------------------------------
      //this.listenTo(this.model, 'change', this.render);
    }
  });

  return RandomView;
});

