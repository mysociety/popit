/*global popit:false console:false alert:false */
define(
  [
    'jquery'
  ],
  function (
    $
  ) {
    "use strict";

    var fields = [ 'name', 'summary', 'birth_date', 'death_date' ];

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

    var cancelEdit = function(){
        window.location = '/persons';
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
      popit.model.save(
        {},
        {
          success: function(model, response) {
              document.location = '/persons/' + model.id;
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
      if($btn.is('.btn-loading')){
        newHtml = $btn.html().replace('Saving Person', 'Save Person');
        $btn.removeClass('btn-loading');
        $btn.html(newHtml);
        popit.model.off('invalid', onInvalid);
      } else {
        newHtml = $btn.html().replace('Save Person', 'Saving Person');
        $btn.addClass('btn-loading');
        $btn.html(newHtml);
        popit.model.on('invalid', onInvalid);
      }
    };

    $(function(){
      $('.entity-cancel-new-mode').on('click', cancelEdit);
      $('.entity-save-new').on('click', saveChanges);
      $('.new-person').on('click', goNewPerson);
    });

  }
);
