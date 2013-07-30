// ------------------------
// Migration page
// ------------------------
//


require(['jquery', 'underscore'], function ($, _) {
  "use strict";

  $(function() {
    var migration_progress_poll_id;

    var getUpdate = function() {
       $.getJSON('/migration/progress/'+id, function(json) {
        var status_html = 'Imported ' + json.progress+' of '+json.total+' items.';
        if (json.total === json.progress && json.count >= 0) {
          status_html = 'Finished importing <a href="/persons" id="_finished">'+json.count+'</a> people.';
          $('#migration_completed_message').show();
          clearInterval(migration_progress_poll_id);
        }
        if (json.err && json.err.name) {
          status_html = 'An error occured: <br><pre>'+json.err.name+'\n\n'+json.err.err+'</pre>';
          $('.progress').addClass('error');
        }
        $('.progress').html(status_html);
      });
    };

    if($('.progress').html()) {

      var arr = window.location.pathname.split('/');
      var id = arr[arr.length-1];

      // Poll for updates every second. Wait one second before polling
      migration_progress_poll_id = window.setInterval( getUpdate, 1000 );
    }

    $('.history-back').click(function(e){
      e.preventDefault();
      window.history.back();
    });

    $('form.migration-form select').change(function() {
      var suggestions,
          tr = $(this).parents('tr'),
          td = $(this).parents('td').next(),
          option = $(this).find(":selected"),
          s = option.filter('option[data-suggestions]').attr('data-suggestions'),
          id = tr.attr('id');
      
      // strict means that the user should only be able to use the provided suggestions
      var attr = option.attr('data-strict');
      var isStrict = typeof attr !== 'undefined' && attr;

      // clear old list/ suggestions
      tr.find('datalist').remove();
      tr.find('select[name=db-attribute]').remove();
      tr.find('.suggestions').html('');
      td.find('input').show().attr('name', 'db-attribute');

      if (!s) {
        return;
      }

      // TODO think about this
      var arr = s.split(',');

      // build combobox
      var cb = '<select>';
      $.each(arr, function(key, value) {
        cb += '<option>' + value + '</option>';
      });
      cb += '</select>';

      if (isStrict) {
        td.append(cb).find('select').attr('name', 'db-attribute');
        td.find('input').attr('name', '').hide();

      } else {
        // create a data list for html5 browsers (i.e. for ff but currently (2012) not webkit)
        var dl = '<datalist id="' + id + '"><select>' + cb + '</select></datalist>';
        
        tr.append(dl);
        tr.find('input[name=db-attribute]').attr('list', id);

        // show suggestions
        suggestions = arr.join(", ");
        tr.find('.suggestions').html(suggestions || '').append(',...');
      }

    });

    $('form.migration-form').submit(function() {
      // do validation

      // there is at least one entry with a first name
      var zipped = _.zip($('form.migration-form [name=db-attribute-class]').map(function(k,v){return $(v).val();}),
                       $('form.migration-form [name=db-attribute]').map(function(k,v){return $(v).val();}));
      var v = zipped.filter(function(v){return v[0] === 'name' && (v[1] === 'First name' || v[1] === 'Full name');});
      if (v.length === 0) {
        window.alert("You have to provide a column for 'First name'!");
        return false;
      }


      return true;
    });

    // initialize
    $('select').change();

  }); 
});
