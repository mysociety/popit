define(
  [ 'Backbone', 'popit/models/person',],
  function ( Backbone, Person  ) {

    var PeopleCollection = Backbone.Collection.extend({
      url: '/api/v1/person',
      model: Person,
    });
    
    return PeopleCollection;

  }
);
