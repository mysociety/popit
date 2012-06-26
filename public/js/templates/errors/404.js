define(['jadeRuntime'], function(jade) {
return function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('<!DOCTYPE html><!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en-gb"><![endif]--><!--[if IE 7]><html class="no-js lt-ie9 lt-ie8" lang="en-gb"><![endif]--><!--[if IE 8]><html class="no-js lt-ie9" lang="en-gb"><![endif]--><!--[if gt IE 8]>\n<!-- --><html lang="en-gb" class="no-js"><![endif]-->\n<head>\n  <meta');
buf.push(attrs({ terse: true, 'charset':('UTF-8') }, {"charset":true}));
buf.push('><!--\n  |\n  -------------------------------------\n  PopIt\n  -------------------------------------\n  A really easy way to store and share information about politicians or other public figures brought to you by mySociety, a charitable project which builds websites that give people simple, tangible benefits in the civic and community, and teaches through demonstration, how to use the internet most efficiently to improve lives. (http://www.mysociety.org/)\n  --------------------------------- -->\n  <meta');
buf.push(attrs({ terse: true, 'name':('creator'), 'content':('http://www.mysociety.org/') }, {"name":true,"content":true}));
buf.push('>\n  <meta');
buf.push(attrs({ terse: true, 'http-equiv':('imagetoolbar'), 'content':('false') }, {"http-equiv":true,"content":true}));
buf.push('>\n  <meta');
buf.push(attrs({ terse: true, 'name':('description'), 'content':('PopIt, a really easy way to store and share information about politicians or other public figures.') }, {"name":true,"content":true}));
buf.push('>\n  <title>Page not found</title>\n  <link');
buf.push(attrs({ terse: true, 'rel':('stylesheet'), 'href':('/css/popit.css'), 'type':('text/css'), 'media':('screen, print'), 'charset':('utf-8') }, {"rel":true,"href":true,"type":true,"media":true,"charset":true}));
buf.push('>\n  <link');
buf.push(attrs({ terse: true, 'rel':('stylesheet'), 'href':('/css/print.css'), 'type':('text/css'), 'media':('print'), 'charset':('utf-8') }, {"rel":true,"href":true,"type":true,"media":true,"charset":true}));
buf.push('>\n  <meta');
buf.push(attrs({ terse: true, 'name':('viewport'), 'content':('width=device-width,initial-scale=1') }, {"name":true,"content":true}));
buf.push('>\n  <!-- script(src=\'/js/libs/modernizr-2.5.3.js\', type=\'text/javascript\', charset=\'utf-8\')-->\n  <script');
buf.push(attrs({ terse: true, 'src':('/js/libs/require-1.0.8.js'), 'data-main':("/js/main-instance"), 'type':('text/javascript'), 'charset':('utf-8') }, {"src":true,"data-main":true,"type":true,"charset":true}));
buf.push('></script>\n</head>');
if ( locals.user)
{
var bodyClasses = (['signed_in']);
}
buf.push('\n<!-- FIXME set the body ID to be the slug version of the instance name instead of united-kingdom-->\n<body');
buf.push(attrs({ terse: true, 'id':('popit-united_kingdom'), "class": (bodyClasses) }, {"class":true}));
buf.push('>');
if ( locals.user)
{
buf.push('\n  <noscript>\n    <div');
buf.push(attrs({ terse: true, 'id':('no-js-warning') }, {}));
buf.push('>Please <a href="http://www.enable-javascript.com/" target="_blank">enable JavaScript</a> - without it much of the admin on this website will not work.</div>\n  </noscript>');
}
buf.push('\n  <header');
buf.push(attrs({ terse: true, 'id':('header') }, {}));
buf.push('>\n    <h1');
buf.push(attrs({ terse: true, "class": ('logo') }, {}));
buf.push('><a');
buf.push(attrs({ terse: true, 'href':('/') }, {"href":true}));
buf.push('><abbr');
buf.push(attrs({ terse: true, 'title':('People Organisations Positions') }, {"title":true}));
buf.push('>Pop</abbr>It');
if ( locals.popit)
{
buf.push('<span');
buf.push(attrs({ terse: true, "class": ('popit-instance') }, {}));
buf.push('> : <span');
buf.push(attrs({ terse: true, 'id':('popit_instance_name') }, {}));
buf.push('>' + escape((interp =  popit.instance_name() ) == null ? '' : interp) + '</span></span>');
}
buf.push('</a></h1>\n    <div');
buf.push(attrs({ terse: true, 'id':('user_menu') }, {}));
buf.push('>');
if ( locals.user)
{
buf.push('\n      <div');
buf.push(attrs({ terse: true, 'id':('signed_in') }, {}));
buf.push('>Hello <span');
buf.push(attrs({ terse: true, "class": ('username') }, {}));
buf.push('>' + escape((interp = user.email) == null ? '' : interp) + '</span>, <a');
buf.push(attrs({ terse: true, 'href':('/logout') }, {"href":true}));
buf.push('>Sign Out</a>\n      </div>');
}
else
{
buf.push('\n      <div');
buf.push(attrs({ terse: true, 'id':('sign_in') }, {}));
buf.push('>already have an account? <a');
buf.push(attrs({ terse: true, 'href':('/login') }, {"href":true}));
buf.push('>Sign In</a></div>');
}
buf.push('\n      <div><a');
buf.push(attrs({ terse: true, 'href':('/info/data-import') }, {"href":true}));
buf.push('>Import data automatically</a></div>\n    </div>\n  </header>\n  <div');
buf.push(attrs({ terse: true, 'id':('content') }, {}));
buf.push('>\n    <div');
buf.push(attrs({ terse: true, "class": ('page-header') }, {}));
buf.push('>\n      <h1>Page not found</h1>\n    </div>\n    <p>Please check your url and try again...</p>\n  </div>\n  <footer');
buf.push(attrs({ terse: true, 'id':('footer') }, {}));
buf.push('>\n    <div>\n      <div');
buf.push(attrs({ terse: true, 'id':('sitemap') }, {}));
buf.push('><a');
buf.push(attrs({ terse: true, 'href':('/'), "class": ('logo') }, {"href":true}));
buf.push('>PopIt</a>\n        <ul>\n          <li><a');
buf.push(attrs({ terse: true, 'href':('/person') }, {"href":true}));
buf.push('>People</a>, <a');
buf.push(attrs({ terse: true, 'href':('/organisation') }, {"href":true}));
buf.push('>Organisations</a></li>\n          <li><a');
buf.push(attrs({ terse: true, 'href':('/FIXME') }, {"href":true}));
buf.push('>About PopIt</a></li>\n          <li><a');
buf.push(attrs({ terse: true, 'href':('/api') }, {"href":true}));
buf.push('>API</a> / <a');
buf.push(attrs({ terse: true, 'href':('/info/data-import') }, {"href":true}));
buf.push('>Data Freedom</a></li>\n          <li><a');
buf.push(attrs({ terse: true, 'href':('/FIXME') }, {"href":true}));
buf.push('>Self Hosting</a></li>\n          <li><a');
buf.push(attrs({ terse: true, 'href':('/info/privacy') }, {"href":true}));
buf.push('>Terms & Privacy Policy</a></li>\n        </ul>\n      </div>\n      <div');
buf.push(attrs({ terse: true, 'id':('about-mysociety') }, {}));
buf.push('><a');
buf.push(attrs({ terse: true, 'href':('http://www.mysociety.org'), 'title':('mySociety') }, {"href":true,"title":true}));
buf.push('><img');
buf.push(attrs({ terse: true, 'src':("/img/mysociety-logo.png"), "class": ('mysociety-logo') }, {"src":true}));
buf.push('></a>\n        <p>This is the <a');
buf.push(attrs({ terse: true, 'href':("http://en.wikipedia.org/wiki/Software_release_life_cycle#Alpha") }, {"href":true}));
buf.push('>α</a>lpha of <a');
buf.push(attrs({ terse: true, 'href':(config.hosting_site_base_url) }, {"href":true}));
buf.push('>PopIt</a>, a new service for lowering the barrier\n          to getting started with transparency projects. Please feel free to\n          make a <a');
buf.push(attrs({ terse: true, 'href':("" + (config.hosting_site_base_url) + "/instances/new") }, {"href":true}));
buf.push('>new instance</a>, and join <a');
buf.push(attrs({ terse: true, 'href':("https://secure.mysociety.org/admin/lists/mailman/listinfo/components") }, {"href":true}));
buf.push('>our mailing list</a> to let us know that you\'re interested in giving it a go\n        </p>\n        <p>Learn more at <a');
buf.push(attrs({ terse: true, 'href':('http://www.mysociety.org'), 'title':('mySociety') }, {"href":true,"title":true}));
buf.push('>www.mysociety.org</a></p>\n      </div>\n    </div>\n    <div');
buf.push(attrs({ terse: true, "class": ('copyright') }, {}));
buf.push('></div>\n  </footer>\n</body></html>');
}
return buf.join("");
};
});
