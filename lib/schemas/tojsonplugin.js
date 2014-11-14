"use strict";

module.exports = jsonTransformPlugin;

function jsonTransformPlugin(schema) {
  schema.set('toJSON', {transform: fixDates});
  schema.set('toObject', {transform: fixDates});
}

function fixDates(doc, ret, options) {
  ['start_date', 'end_date', 'birth_date', 'death_date', 'founding_date', 'dissolution_date'].forEach(function(field) {
    if (!ret[field]) {
      ret[field] = null;
    }

  });
  return ret;
}
