define(['jadeRuntime'], function(jade) {
return function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
if ( persons.length)
{
// iterate persons
;(function(){
  if ('number' == typeof persons.length) {
    for (var $index = 0, $$l = persons.length; $index < $$l; $index++) {
      var person = persons[$index];

buf.push('\n<li><a');
buf.push(attrs({ 'href':(person.meta.edit_url) }, {"href":true}));
buf.push('>' + escape((interp =  person.name ) == null ? '' : interp) + ' (' + escape((interp =  person.slug ) == null ? '' : interp) + ') </a></li>');
    }
  } else {
    for (var $index in persons) {
      var person = persons[$index];

buf.push('\n<li><a');
buf.push(attrs({ 'href':(person.meta.edit_url) }, {"href":true}));
buf.push('>' + escape((interp =  person.name ) == null ? '' : interp) + ' (' + escape((interp =  person.slug ) == null ? '' : interp) + ') </a></li>');
   }
  }
}).call(this);

}
else
{
buf.push('\n<li>No matches</li>');
}
}
return buf.join("");
};
});
