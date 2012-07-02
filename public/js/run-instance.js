require([
  'augmenters/mailchecker',
  'augmenters/search-box',
  'augmenters/slug-validation',
  'augmenters/sign-in-toggle',
  'augmenters/edit-in-place',
]);

require (
  ['jquery', 'popit/app'],
  function ($, App) {
    $( function() { App.start() } );
  }
);
