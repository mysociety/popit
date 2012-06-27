define(["jquery","Backbone","backbone-forms","underscore","utils/slugify","templates/person/new","popit/models/person","popit/views/suggestions"],function(a,b,c,d,e,f,g,h){var i=b.View.extend({initialize:function(){this.form=new c({model:this.model}),this.suggestionsView=new h},render:function(){var b=a(f({})),c=a(this.form.render().el);return b.find("form").prepend(c.children()),this.$el.html(b),this.$("ul.suggestions").html(this.suggestionsView.render().el),this},events:{"submit form ":"submitForm","keyup input[name=name]":"nameEdit"},submitForm:function(b){b.preventDefault();var c=this,e=c.form,f=e.commit();d.isEmpty(f)&&this.model.save({},{success:function(a,b){document.location=b.meta.edit_url},error:function(b,c){var f=a.parseJSON(c.responseText).errors||{};d.each(f,function(a,b){e.fields[b]&&e.fields[b].setError(a)})}})},nameEdit:function(a){var b=this.$(":input[name=name]"),c=this.$(":input[name=slug]");c.val(e(b.val()));var d=this;return d.suggestionsView.setName(b.val()),!0}});return i})