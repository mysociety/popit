define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'text!templates/membership/new.html',
    'instance-admin/models/person',
    'instance-admin/models/organization',
    'instance-admin/models/membership',
    'instance-admin/utils/select2-helpers'

  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    membershipTemplate,
    PersonModel,
    OrganizationModel,
    MembershipModel,
    select2Helpers
  ) {
    "use strict";

    var MembershipNewView = Backbone.View.extend({

      membershipTemplate: _.template(membershipTemplate),
      // initialize: function () {},

      render: function () {

        // Render the template
        var $content = $( this.membershipTemplate() );

        // find the bits that are interesting and store them for easy access
        this.$role_input        = $content.find('[name=role]');
        this.$person_input       = $content.find('[name=person_id]');
        this.$organization_input = $content.find('[name=organization_id]');
        this.$start_date_input   = $content.find('[name=start_date]');
        this.$end_date_input     = $content.find('[name=end_date]');
        this.$errors_list        = $content.find('ul.error');

        // If we have some details already set, store them
        this.$role_input.val(        this.model.get('role') );
        this.$person_input.val(       this.model.get('person_id') );
        this.$organization_input.val( this.model.get('organization_id') );

        // set up the role as an autocompletor
        this.$role_input.select2(
          select2Helpers.create_arguments_for_autocompleter({
            placeholder:      "e.g President, CEO, Professor, Coach",
            autocomplete_url: "/autocomplete/memberships"
          })
        );

        // set up the model lookups
        this.$person_input.select2( select2Helpers.create_arguments_for_model({
          placeholder: "e.g Joe Bloggs, Jane Smith",
          model:       PersonModel,
          errors_list: this.$errors_list
        }) );
        this.$organization_input.select2( select2Helpers.create_arguments_for_model({
          placeholder: "e.g Apple Inc, UK Parliament, Kenyatta University",
          model:       OrganizationModel,
          errors_list: this.$errors_list
        }) );

        // hide inputs if requested (not happy with this - not very elegant :( )
        if (this.options.fields_to_hide.person ) $content.find('p.person').hide();
        if (this.options.fields_to_hide.organization ) $content.find('p.organization').hide();

        // add our content to the page
        this.$el.html( $content );

        return this;
      },

      events: {
        'submit form': 'submitForm'
      },

      submitForm: function (e) {
        e.preventDefault();

        var view = this;

        // clear the errors
        view.$errors_list.html('');

        // Get the role, error if it is not set
        var job_role_data = view.$role_input.select2('data');
        var job_role = job_role_data ? job_role_data.text : false;
        if (!job_role) {
          view.$errors_list.append("<li>Role is required</li>");
          return;
        }

        // for the person and organization create the entry on the server if
        // it is a new one (ie does not have an id)
        $.when(
          // get the person id, creating them if needed.
          $.Deferred(
            select2Helpers.create_model_if_needed_for_data(
              PersonModel,
              view.$person_input.select2('data')
            )
          ),
          $.Deferred(
            select2Helpers.create_model_if_needed_for_data(
              OrganizationModel,
              view.$organization_input.select2('data')
            )
          )
        )
        .then(function(person_id, organization_id) {

          var start_date_data = view.$start_date_input.val();
          var end_date_data   = view.$end_date_input.val();

          // create a new membership
          var membership = new MembershipModel({
            person_id:       person_id,
            organization_id: organization_id,
            role:        job_role,
            start_date:   start_date_data || null,
            end_date:     end_date_data || null
          });

          // Save it
          membership.save({},{
            success: function (model, response ) {
                document.location.reload();
            },
            error: function (model, response) {
              view.$errors_list.append('<li>Something went wrong saving the membership to the server.</li>');
            }
          });
        });
      }

    });

    return MembershipNewView;

  }
);
