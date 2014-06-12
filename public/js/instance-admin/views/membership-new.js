/*global popit:false */
define(
  [
    'jquery',
    'Backbone',
    'underscore',
    'text!templates/membership/new.html',
    'text!templates/membership/list-item.html',
    'instance-admin/models/person',
    'instance-admin/models/organization',
    'instance-admin/models/membership',
    'instance-admin/models/post',
    'instance-admin/utils/select2-helpers'

  ],
  function (
    $,
    Backbone,
    _,
    membershipTemplate,
    membershipItemTemplate,
    PersonModel,
    OrganizationModel,
    MembershipModel,
    PostModel,
    select2Helpers
  ) {
    "use strict";

    var MembershipNewView = Backbone.View.extend({

      membershipTemplate: _.template(membershipTemplate),
      membershipItemTemplate: _.template(membershipItemTemplate),
      // initialize: function () {},

      render: function () {
        var view = this;

        var model = this.model.toJSON();
        view.$source_el = this.options.source_el;
        view.model_type = this.options.type;

        // Render the template
        var $content = $( this.membershipTemplate({
          member: model.person_id,
          membership: model,
          type: view.model_type
        }) );

        // find the bits that are interesting and store them for easy access
        this.$errors_list = $content.find('ul.error');
        var fields = [ 'role', 'label', 'person_id', 'organization_id', 'post_id', 'start_date', 'end_date', 'area_id', 'area_name' ];
        var fields_simple = [ 'label', 'start_date', 'end_date' ];

        _.each(fields, function(val) {
          view['$' + val + '_input'] = $content.find('[name=' + val + ']');
        });

        _.each(fields_simple, function(val) {
          view['$' + val + '_input'].val( view.model.get(val) );
        });
        var area = view.model.get('area');
        if (area) {
          view.$area_id_input.val( area.id );
          view.$area_name_input.val( area.name );
        }

        // set up the role as an autocompletor
        this.$role_input.select2(
          select2Helpers.create_arguments_for_autocompleter({
            placeholder:      "e.g President, CEO, Professor, Coach",
            autocomplete_url: "/autocomplete/memberships"
          })
        );

        if (view.model_type === 'organization') {
          // set up the model lookups
          this.$person_id_input.select2( select2Helpers.create_arguments_for_model({
            placeholder: "e.g Joe Bloggs, Jane Smith",
            //url: '/api/v0.1/persons',
            url: '/autocomplete/persons',
            errors_list: this.$errors_list
          }) );
        } else if (view.model_type === 'person') {
          this.$organization_id_input.select2( select2Helpers.create_arguments_for_model({
            placeholder: "e.g Apple Inc, UK Parliament, Kenyatta University",
            //url: '/api/v0.1/organizations',
            url: '/autocomplete/organizations',
            errors_list: this.$errors_list,
            current_post: this.$post_id_input
          }) );
        }
        this.$post_id_input.select2( select2Helpers.create_arguments_for_model({
          placeholder: "e.g MP for Avalon, President of the US",
          //url: '/api/v0.1/posts',
          url: '/autocomplete/posts',
          lookup_term: 'label',
          no_creation: true,
          errors_list: this.$errors_list
        }) );

        // If we have some details already set, store them
        var fields_select2 = {
          'person_id': [ 'id', 'name' ],
          'organization_id': [ 'id', 'name' ],
          'post_id': [ 'id', 'label' ],
          'role': [ '', '' ]
        };
        _.each(fields_select2, function(val, key) {
            var obj = view.model.get(key);
            if (obj) {
                var id = val[0] ? obj[val[0]] : obj;
                var text = val[1] ? obj[val[1]] : obj;
                view['$' + key + '_input'].select2('data', { id: id, text: text });
            }
        });

        if (view.model_type === 'person') {
          view.$person_id_input.val(view.model.get('person_id').id);
        } else if (view.model_type === 'organization') {
          view.$organization_id_input.val(view.model.get('organization_id').id);
        }

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

        var view = this,
            new_model = {},
            errors = false;

        // clear the errors
        view.$errors_list.html('');

        // Get the role, error if it is not set
        var role_data = view.$role_input.select2('data');
        new_model.role = role_data ? role_data.text : null;

        var post_id = view.$post_id_input.select2('data');
        new_model.post_id = post_id.length > 0 ? post_id.id : null;

        var fields_simple = [ 'label', 'start_date', 'end_date', 'area_id', 'area_name' ];
        _.each(fields_simple, function(val){
          new_model[val] = view['$' + val + '_input'].val() || null;
        });

        var dateValidator = /^[0-9]{4}(-[0-9]{2}){0,2}$/;
        if (new_model.start_date && !new_model.start_date.match(dateValidator)) {
          view.$errors_list.append('<li>Start date not in correct format.</li>');
          errors = true;
        }
        if (new_model.end_date && !new_model.end_date.match(dateValidator)) {
          view.$errors_list.append('<li>End date not in correct format.</li>');
          errors = true;
        }
        if (errors) {
          return;
        }

        if (new_model.area_id) {
            new_model.area = { 'id': new_model.area_id, 'name': new_model.area_name };
            delete new_model.area_id;
            delete new_model.area_name;
        }

        var data;
        if (view.model_type === 'person') {
          data = {id: view.$person_id_input.val()};
          // use val
        } else if (view.model_type === 'organization') {
          data = view.$person_id_input.select2('data');
        }

        // for the person and organization create the entry on the server if
        // it is a new one (ie does not have an id)
        $.when(
          // get the person id, creating them if needed.
          $.Deferred(
            select2Helpers.create_model_if_needed_for_data(
              PersonModel,
              data
            )
          ),
          $.Deferred(
            select2Helpers.create_model_if_needed_for_data(
              OrganizationModel,
              view.$organization_id_input.select2('data')
            )
          )
        )
        .then(function(person_id, organization_id) {

          if (!person_id || !organization_id) {
            view.$errors_list.append('<li>You must specify a person and an organization.</li>');
            return;
          }

          new_model.person_id = person_id;
          new_model.organization_id = organization_id;
          view.model.save(new_model, {
            success: function (model, response ) {
              if ( view.model_type == 'person' ) {
                var o = new OrganizationModel({ id: model.get('organization_id') });
                o.fetch({ async: false });
                model.set('organization_id', o.attributes);
              } else if ( view.model_type == 'organization' ) {
                var person = new PersonModel({ id: model.get('person_id') });
                person.fetch({ async: false });
                model.set('person_id', person.attributes);
              }

              if ( post_id.length > 0 ) {
                var post = new PostModel({ id: model.get('post_id') });
                post.fetch({ async: false });
                model.set('post_id', post.attributes);
              }
              var person = new PersonModel({id: model.get('person_id')});
              person.fetch({async: false});
              var template_args = {
                type: view.model_type,
                membership: model.toJSON(),
                member: person.toJSON(),
                organization: model.toJSON().organization_id
              };

              var $changed = $( view.membershipItemTemplate( template_args ) );
              view.$source_el.replaceWith( $changed );
              $changed.children('.view-mode').hide();
              $changed.children('.edit-mode').show();
              popit.model.memberships.add(model);
              $changed.data('id', model.cid);
              $.fancybox.close();
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
