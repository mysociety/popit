/*

  This is a bit of a hack to allow all the various partial date templates to be
  called from one place. The root cause is that it is hard to pass variables
  into jade templates, so each occurrence of the partial templates is distinct.
  
   This module loads them all and give other code in the admin an easy way to
  call them programatically.

*/

define(
  [
    'templates/partial-date/person-birth-date'
  ],
  function (
    personBirthDateTemplate
  ) {
    "use strict";
    
    return {
      'person-birth-date': personBirthDateTemplate
    };
    
  }
);
