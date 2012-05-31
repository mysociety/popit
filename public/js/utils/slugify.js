// ------------------------
// Slug Validation
// ------------------------

define( [], function() {

  return function (input) {
    return input
      .replace( /[^a-z0-9\-]+/gi, '-' )   // replace bad chars with '-'
      .replace( /-+/g,            '-' )   // drop multiple '-'
      .replace( /-$/,             ''  )   // drop trailing '-'
      .replace( /^-/,             ''  )   // drop leading '-'
      .toLowerCase();
  }

});



