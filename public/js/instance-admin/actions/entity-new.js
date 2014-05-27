/*global popit:false console:false alert:false */
define(['jquery'], function ($) {
  "use strict";

  var fields = [];
  var actionLabel = 'Save', progressLabel = 'Saving';

  var onInvalid = function(model, err) {
    for ( var i = 0; i < fields.length; i++ ) {
      var field = fields[i];
      if ( err[field] ) {
        var $dd = $('[data-api-name="' + field + '"]').parent();
        $dd.addClass('has-error'); // the text input and error text
        $dd.prev().addClass('has-error'); // the label
        $('.edit-mode-error', $dd).show();
        toggleSavingButton();
      }
    }
  };

  var goNewPerson = function() {
      window.location = '/persons/new';
  };

  var goNewOrganization = function() {
      window.location = '/organizations/new';
  };

  var cancelEdit = function(){
      window.location = '/' + popit.type + 's';
  };

  var saveChanges = function(){
    toggleSavingButton();
    var name = $('.view-mode[data-api-name="name"]').val();
    if ( !name ) {
        $('.view-mode[data-api-name="name"]').parent().addClass('has-error');
        toggleSavingButton();
        return;
    }
    popit.model.set('name', name);
    if ( popit.type === 'person' ) {
      popit.model.set('summary', $('.view-mode[data-api-name="summary"]').val());
      var dates = ['death_date', 'birth_date'];
      for ( var i = 0; i < dates.length; i++ ) {
          var selector = '.view-mode[data-api-name="' + dates[i] + '"]';
          var value = $(selector).val();
          if ( ! value ) {
              value = null;
          }
          popit.model.set(dates[i], value);
      }
    } else if ( popit.type === 'organization' ) {
      popit.model.set('classification', $('.view-mode[data-api-name="classification"]').val());
    }
    popit.model.save(
      {},
      {
        success: function(model, response) {
            document.location = '/' + popit.type + 's/' + model.id;
        },
        error: function(obj, err) {
            console.log(err);
            alert('Something went wrong, please try again later');
            toggleSavingButton();
        }
      }
    );
  };

  var toggleSavingButton = function(){
    var newHtml;
    var $btn = $('.entity-save-new');
    if ( popit.type === 'person' ) {
    } else if ( popit && popit.type === 'organization' ) {
    }
    if($btn.is('.btn-loading')){
      newHtml = $btn.html().replace(progressLabel, actionLabel);
      $btn.removeClass('btn-loading');
      $btn.html(newHtml);
      popit.model.off('invalid', onInvalid);
    } else {
      newHtml = $btn.html().replace(actionLabel, progressLabel);
      $btn.addClass('btn-loading');
      $btn.html(newHtml);
      popit.model.on('invalid', onInvalid);
    }
  };

  $(function(){
    $('.entity-cancel-new-mode').on('click', cancelEdit);
    $('.entity-save-new').on('click', saveChanges);
    $('.new-person').on('click', goNewPerson);
    $('.new-organization').on('click', goNewOrganization);

    if ( typeof(popit) !== 'undefined' ) {
      if ( popit.type === 'person' ) {
        fields = [ 'name', 'summary', 'birth_date', 'death_date' ];
        actionLabel = 'Save Person';
        progressLabel = 'Saving Person';
      } else if ( popit.type === 'organization' ) {
        var fields = [ 'name', 'classification' ];
        actionLabel = 'Save Organization';
        progressLabel = 'Saving Organization';
      }
    }

  });

});
