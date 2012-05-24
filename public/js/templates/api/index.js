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
buf.push('>\n  <title>API</title>\n  <link');
buf.push(attrs({ terse: true, 'rel':('stylesheet'), 'href':('/css/popit.css'), 'type':('text/css'), 'media':('screen, print'), 'charset':('utf-8') }, {"rel":true,"href":true,"type":true,"media":true,"charset":true}));
buf.push('>\n  <link');
buf.push(attrs({ terse: true, 'rel':('stylesheet'), 'href':('/css/print.css'), 'type':('text/css'), 'media':('print'), 'charset':('utf-8') }, {"rel":true,"href":true,"type":true,"media":true,"charset":true}));
buf.push('>\n  <meta');
buf.push(attrs({ terse: true, 'name':('viewport'), 'content':('width=device-width,initial-scale=1') }, {"name":true,"content":true}));
buf.push('>\n  <!-- script(src=\'/js/libs/modernizr-2.5.3.js\', type=\'text/javascript\', charset=\'utf-8\')-->\n  <script');
buf.push(attrs({ terse: true, 'src':('/js/require.js'), 'data-main':("/js/main-instance"), 'type':('text/javascript'), 'charset':('utf-8') }, {"src":true,"data-main":true,"type":true,"charset":true}));
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
buf.push('>\n      <h1>API</h1>\n    </div>\n    <p>The API allows you to easily access all the data stored in PopIt from your code or other websites.</p>\n    <h2>Getting Started</h2>\n    <p>The API returns  <a');
buf.push(attrs({ terse: true, 'href':("http://en.wikipedia.org/wiki/JSON") }, {"href":true}));
buf.push('>JSON</a> - a data format that is easily usable in all programming languages. It is possible to view JSON in your browser (and easily follow embedded links) if you have one of the following extensions installed:</p>\n    <ul>\n      <li><a');
buf.push(attrs({ terse: true, 'href':("https://chrome.google.com/webstore/detail/chklaanhfefbnpoihckbnefhakgolnmc") }, {"href":true}));
buf.push('>JSONView</a> for Chrome</li>\n      <li><a');
buf.push(attrs({ terse: true, 'href':("https://addons.mozilla.org/en-US/firefox/addon/jsonview/") }, {"href":true}));
buf.push('>JSONView</a> for FireFox</li>\n      <li><a');
buf.push(attrs({ terse: true, 'href':("http://stackoverflow.com/questions/2483771/how-can-i-convince-ie-to-simply-display-application-json-rather-than-offer-to-do") }, {"href":true}));
buf.push('>Not sure it can be done easily</a> for Internet Explorer :(</li>\n      <li>Try a search for "JSON Viewer &lt;your browser name&gt;" for other browsers.</li>\n    </ul>\n    <p>\n       \n      You can now <a');
buf.push(attrs({ terse: true, 'href':("/api/v1") }, {"href":true}));
buf.push('>enter the API</a> and click around to navigate.\n    </p>\n    <h2>Basics</h2>\n    <p>The API is based on <a');
buf.push(attrs({ terse: true, 'href':("http://en.wikipedia.org/wiki/Representational_state_transfer") }, {"href":true}));
buf.push('>REST</a></p>\n    <p>Currently the API is read only (only \'GET\' requests supported) and likely to change as it undergoes development. Adding and editing data via the API will be added soon.</p>\n    <h3>API Versions</h3>\n    <p>There is a version string in the API url. This will be updated if the API undergoes siginificant changes that breaks backwards compatability. Old APIs will be supported for a bit, but will eventually be deprecated. Hopefully version changes will be very rare.</p>\n    <p><b>NOTE</b> until PopIt is considered stable the API will change and the \'v1\' version will break. Please contact us if you need to know which parts of the API are stable.</p>\n    <h3>result / results</h3>\n    <p>When you make a query the returned data will always be a hash. There will be a result or results key that contains the data you\'ve requested.</p>\n    <h3>meta</h3>\n    <p>When you make requests to the API you\'ll often get little \'meta\' blocks in the results. These blocks are added to the data by the API to provide additional information that may be helpful. For example it might contain links to the API endpoint for a result in a search, or a link to the web page where you can edit the data.</p>\n    <p>The meta blocks are also used to provide next and previous links in list results (not implemented yet).</p>\n    <h3>errors</h3>\n    <p>If something goes wrong there will be an \'error\' or \'errors\' key that will explain the error. Often an HTTP error code will also be used (eg \'404\' if a result cannot be found).</p>\n    <h3>ObjectIds and slugs</h3>\n    <p>Objects in PopIt are always identified in the API by their ObjectId - which is generated by the database and is a 24 character hex string.</p>\n    <p>As a conveniance you can also look up objects using their slug. If found the request will be redirected to the correct ObjectId based query. This is so that you can use the slugs in URLs on your site and easily retrieve data without having to store the corresponding ObjectIds locally.</p>\n    <pre>    by ObjectId:  /api/v1/person/4f99219333fa2efc68000006\n    by slug:      /api/v1/person/joe-bloggs</pre>\n    <p>Note that slugs may change so your links may break. ObjectIds will never change.</p>\n    <h3>Searching</h3>\n    <p>Currently only simple searching implemented - you can search by ObjectIds and by case-insensitive string matching. Examples:</p>\n    <pre>    /api/v1/person?name=joe\n    /api/v1/position?person=4f99219333fa2efc68000006</pre>\n    <p>Better searching (exact matches, gte, etc) is on the TODO list.</p>\n    <h3>JSONP</h3>\n    <p>\n       \n      Read (GET) requests to the API can have an optional <tt>callback</tt> parameter \n      which will cause <a');
buf.push(attrs({ terse: true, 'href':("http://en.wikipedia.org/wiki/JSONP") }, {"href":true}));
buf.push('>JSONP</a> to be returned. This might be useful if querying the API from a browser \n      on another website.\n    </p>\n    <h3>Auth</h3>\n    <p>\n      For write operations on the API you need to be authenticated. This can \n      either be done using <a');
buf.push(attrs({ terse: true, 'href':("http://en.wikipedia.org/wiki/Basic_access_authentication") }, {"href":true}));
buf.push('>Basic Authentication</a> or by cookie auth. Basic is probably best for scripts and pragramatic \n      access, cookie based for Ajax calls etc.\n    </p>\n    <p>\n       \n      We will probably need to add token based auth <a');
buf.push(attrs({ terse: true, 'href':("https://github.com/mysociety/popit/issues/113") }, {"href":true}));
buf.push('>(#113) </a> in the future, as well as adding CSRF protection <a');
buf.push(attrs({ terse: true, 'href':("https://github.com/mysociety/popit/issues/112") }, {"href":true}));
buf.push('>(#112)</a>. Tickets have been created for these in the issue tracker.\n    </p>\n  </div>\n  <footer');
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
