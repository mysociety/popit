// ------------------------
// Migration page
// ------------------------
//

"use strict";

require(['order!jquery'], function ($) {
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

    $('form').submit(function() {
      // TODO validation
    });

    // initialize
    $('select').change();

  }); 
});
