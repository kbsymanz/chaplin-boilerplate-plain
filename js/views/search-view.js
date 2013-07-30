define([
  'chaplin',
  'views/base/view',
  'text!templates/search-section.hbs',
  'jquery',
], function(Chaplin, View, template, $) {
  'use strict';

  var SearchView = View.extend({
    // Automatically render after initialize
    autoRender: true,

    className: 'search',

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,

    initialize: function(options) {
      SearchView.__super__.initialize.apply(this, arguments);

      // --------------------------------------------------------
      // Shortcuts.
      // --------------------------------------------------------
      this._searchFieldSel = 'input#search_field';
      this._progressBarSel = '#search_progress';
      this._searchResultsSel = '#search_results';

      // --------------------------------------------------------
      // Events and bindings.
      // --------------------------------------------------------
      this.delegate('keypress', this._searchFieldSel, this.doSearch);
      this.listenTo(this.model, 'change:results', this.render);
      this.listenTo(this.model, 'change:isSearching', this.render);
      this.listenTo(this.model, 'change:results', this.save2List);
    },

    // --------------------------------------------------------
    // Search on the contents in the search field.
    // --------------------------------------------------------
    doSearch: function(evt) {
      var term
        ;

      // --------------------------------------------------------
      // When the user presses Enter, do the search.
      // --------------------------------------------------------
      if (evt.which === 13) {
        evt.preventDefault();
        term = $(this._searchFieldSel).val();
        this.model.set('term', term);
      }
    },

    // --------------------------------------------------------
    // Save a copy of the model to our list so that it can be quickly
    // retrieved later if needed. We save a copy because this
    // view always reuses the same model. But only save when a
    // new result set is received, not when it is cleared.
    // --------------------------------------------------------
    save2List: function(model, value, options) {
      var newModel
        ;
      if (value) {
        newModel = model.clone();
        newModel.set('id', model.get('searchTime'));
        Chaplin.mediator.searchList.add(newModel);
      }
    },

    // --------------------------------------------------------
    // Display the searching and the results as appropriate.
    // --------------------------------------------------------
    render: function() {
      var results
        ;
      SearchView.__super__.render.apply(this);
      if (this.model.get('isSearching')) {
        $(this._progressBarSel).removeClass('hidden');
      } else {
        $(this._progressBarSel).addClass('hidden');
      }
      if (this.model.get('term').length) {
        $(this._searchFieldSel).val(this.model.get('term'));
      }

      // --------------------------------------------------------
      // When results are retrieved, display them too and get rid
      // of the progress bar.
      // --------------------------------------------------------
      results = this.model.get('results');
      if (results) {
        $(this._searchResultsSel).removeClass('hidden');
      }

      // TODO: get the following to work.
      $(this._searchFieldSel).focus();
    }
  });

  return SearchView;
});

