// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

require(
  [
    'jquery',
    'popit/models/person',
    'popit/views/person-new'
  ],
  function (
    $,
    PersonModel,
    NewPersonView
  ) {

    // handle the API wrapping the responses in result(s): {...}
    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);
          return data.results || data.result || data;
        }
      }
    });


    $(function() {
  
    	$('#new-person').click(function(event) {

        event.preventDefault();
        
        var person = new PersonModel({});
        var view   = new NewPersonView({model: person});

        view.render();

        var $replacement = view.$el;
        $replacement.hide();
        $(this).hide().replaceWith( $replacement );
        $replacement.slideDown();

        view.$(':input:first').focus();
    	});
  
    });
  }
);
