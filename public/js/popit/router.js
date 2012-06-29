define (
  [
    'templates/person/list-item',    
    // 'templates/person/list',
    'popit/collections/people',
    'Backbone',
    'Backbone.Marionette',
  ],
  function(
    PersonCompactTemplate,
    // PersonListTemplate,
    PeopleCollection,
    Backbone
  ) {

    var getApp = function () {
      var initApp;
      require(['popit/app'], function (app) {
          initApp = app;
      });
      return initApp;
    };

    var AppRouter = Backbone.Marionette.AppRouter.extend({
    
      routes: {
        'person':       'personList',
        'person/:slug': 'personView',
      },    
    
      personList: function () {
        console.log('personList route started');

        var PersonView = Backbone.Marionette.ItemView.extend({
          template: PersonCompactTemplate,

          beforeRender: function () {
            console.log("the view is about to be rendered");
            console.log(this.model);
          }
          
        });
        

        var PersonListView = Backbone.Marionette.CollectionView.extend({
          tag: 'ul',
          itemView: PersonView,
        });

        var people = new PeopleCollection();
        var listView = new PersonListView({ collection: people });

        people.fetch();

        getApp().contentRegion.show( listView );
      },

      personView: function (slug) {
        console.log('personView route started:', slug);
      }            

    });
    
    return AppRouter;
  }
);
