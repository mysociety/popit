// ------------------------
// Migration page
// ------------------------
//

"use strict";

require(['jquery', 'underscore'], function ($, _) {
  $(function() {

    $('select').change(function() {
      var suggestions,
          tr = $(this).parents('tr'),
          td = $(this).parents('td').next(),
          option = $(this).find(":selected"),
          s = option.filter('option[data-suggestions]').attr('data-suggestions'),
          id = tr.attr('id');
      
      // strict means that the user should only be able to use the provided suggestions
      var attr = option.attr('data-strict');
      var isStrict = typeof attr !== 'undefined' && attr !== false;

      // clear old list/ suggestions
      tr.find('datalist').remove();
      tr.find('select[name=db-attribute]').remove();
      tr.find('.suggestions').html('');
      td.find('input').show().attr('name', 'db-attribute');

      if (!s) {
        return;
      }

      // TODO think about this
      var arr = eval(s);

      // build combobox
      var cb = '<select>';
      $.each(arr, function(key, value) {
        cb += '<option>' + value, '<option>';
      });
      cb += '</select>';

      if (isStrict) {
        td.append(cb).find('select').attr('name', 'db-attribute');
        td.find('input').attr('name', '').hide();

      } else {
        // create a data list for html5 browsers (ie ff but currently (2012) not webkit
        var dl = '<datalist id="' + id + '"><select>' + cb + '</select></datalist>';
        
        tr.append(dl);
        tr.find('input[name=db-attribute]').attr('list', id);

        // show suggestions
        suggestions = arr.join(", ")  
        tr.find('.suggestions').html(suggestions || '').append(',...');
      }

    });

    $('form.migration-form').submit(function() {
      // there is at least one entry with a first name
      var zipped = _.zip($('form.migration-form [name=db-attribute-class]').map(function(k,v){return $(v).val()}),
                       $('form.migration-form [name=db-attribute]').map(function(k,v){return $(v).val()}))
      var v = zipped.filter(function(v){return v[0] === 'name' && (v[1] === 'First name' || v[1] === 'Full name')})
      if (v.length == 0) {
        alert("You have to provide a column for 'First name'!");
        return false;
      }


      return true;
    });

    // initialize
    $('select').change();

  }); 
});
