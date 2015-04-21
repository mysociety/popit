JSHINT = ./node_modules/.bin/jshint

all: node-modules css

node-modules:
	npm install
	npm prune

jshint:
	$(JSHINT) *.js lib/ hosting-app/ instance-app/ test/
	cd public/js; ../../$(JSHINT) .

css:
	compass compile
	cp -r public/sass/jqueryui/images public/css/
	cp -r public/sass/select2/select2.png public/css/
	cp -r public/sass/select2/select2x2.png public/css/
	cp -r public/sass/select2/spinner.gif public/css/

public-production: css
	rm -rf public-build public-production
	node_modules/.bin/r.js -o public/js/app.build.js
	mkdir public-production

	# copy all the static assets
	mv public-build/css         public-production/
	mv public-build/favicon.ico public-production/
	mv public-build/fonts       public-production/
	mv public-build/img         public-production/

	# copy across only the javascript that we need
	mkdir -p public-production/js/libs/jsoneditor/img
	mv public-build/js/libs/require-*  public-production/js/libs/
	mv public-build/js/libs/jsoneditor/img/* public-production/js/libs/jsoneditor/img/
	mv public-build/js/libs/jsoneditor/*.css  public-production/js/libs/jsoneditor/
	mv public-build/js/main-*          public-production/js/
	mv public-build/js/libs/zeroclipboard public-production/js/libs/

	# clean up generated content that we don't need now
	rm -r public-build

test:
	@NODE_ENV=testing ./node_modules/.bin/mocha --recursive

clean:
	compass clean
	rm -rf public/css
	rm -rf public-build
	rm -rf public-production

.PHONY: test css public-production clean node-modules
