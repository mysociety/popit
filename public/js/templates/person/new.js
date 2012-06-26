define(['jadeRuntime'], function(jade) {
return function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<div');
buf.push(attrs({ 'id':('new-person') }, {}));
buf.push('>\n  <form');
buf.push(attrs({ 'name':("create-new-person") }, {"name":true}));
buf.push('>\n    <!-- more content inserted in the bb view-->\n    <h2>Suggestions</h2>\n    <ul');
buf.push(attrs({ "class": ('suggestions') }, {}));
buf.push('></ul>\n    <input');
buf.push(attrs({ 'type':('submit'), 'value':("Create new person") }, {"type":true,"value":true}));
buf.push('/>\n  </form>\n</div>');
}
return buf.join("");
};
});
