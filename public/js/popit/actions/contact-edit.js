// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'popit/app',
    'popit/models/contact',
    'popit/views/contact-edit',
    'jquery.fancybox',    
  ],
  function (
    $,
    App,
    ContactModel,
    ContactEditView
  ) {

    App.addInitializer(function(options){

      $('#content').on('click', 'a.contact-edit', function(event) {
        var $link    = $(this);
        var $element = $(this).closest('li');

        event.preventDefault();

        // create contact. Might be existing one, or a new one.
        var contact = new ContactModel({
          id: $link.attr('data-id') || null
        });

        // Manually set the urlRoot for this contact. It needs to include the 
        // document id that this contact is embedded in. (Don't seem to be able 
        // to set in in contructor above)
        contact.urlRoot = $link.attr('data-url-root');

        // create the view. Hook it up to the enclosing element.
        var view    = new ContactEditView({
          model: contact,
          el:    $element
        });

        // If this is a new contact just render the view. If it is existing then 
        // fetch latest details from the API (they'll get rendered by the 
        // 'change' event).
        contact.isNew() ? view.render() : contact.fetch();
        
      });
      
    });
  }
);
