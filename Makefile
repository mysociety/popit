
# note - this needs to be default so that the nodeunit process will exit with
# error if tests fail. Otherwise make will not abort.
REPORTER = default 

JSHINT = ./node_modules/.bin/jshint

STOP_TEST_SERVER  = tests/test-server-stop.bash
START_TEST_SERVER = $(STOP_TEST_SERVER); tests/test-server-start.bash

# see http://stackoverflow.com/questions/4493205/unix-sort-of-version-numbers
GET_LATEST_TAG  = git tag | sort -t. -k 1,1n -k 2,2n -k 3,3n -k 4,4n | tail -1


all: node-modules css


node-modules:
	npm install
	npm prune

npm-update:
	rm npm-shrinkwrap.json
	rm -rf node_modules
	npm install
	npm prune
	make test
	npm shrinkwrap

npm-shrinkwrap:
	npm install
	rm npm-shrinkwrap.json
	npm install
	npm prune
	npm shrinkwrap

jshint:
	$(JSHINT) *.js lib/ hosting-app/ instance-app/ tests/
	cd public/js; ../../$(JSHINT) .

css:
	compass compile
	cp -r public/sass/jqueryui/images public/css/
	cp -r public/sass/select2/select2.png public/css/
	cp -r public/sass/select2/select2x2.png public/css/
	cp -r public/sass/select2/spinner.gif public/css/


optipng:
	find public -name '*.png' | xargs optipng --clobber -o4


js-templates:
	rm -rf public/js/templates.js
	node_modules/.bin/uta-compile-templates-to-amd instance-app/views > public/js/templates.js

public-production: css js-templates
	rm -rf public-build public-production
	node_modules/.bin/r.js -o public/js/app.build.js
	mkdir public-production

	# copy all the static assets
	mv public-build/css         public-production/
	mv public-build/favicon.ico public-production/
	mv public-build/fonts       public-production/
	mv public-build/img         public-production/

	# copy across only the javascript that we need
	mkdir -p public-production/js/libs
	mv public-build/js/libs/require-*  public-production/js/libs/
	mv public-build/js/main-*          public-production/js/

	# clean up generated content that we don't need now
	rm -r public-build
	rm -r public/js/templates.js	


tidy:
	# this should tidy, but not implemented yet
	# The output is not as nice as I'd like
	# sass-convert --recursive --in-place --from scss --to scss public/sass/


test: clean node-modules jshint test-unit test-browser
	echo "ALL TESTS PASS"

test-unit:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
	  --reporter $(REPORTER) \
	  tests/unit

test-browser: css public-production
	$(START_TEST_SERVER)
	@NODE_ENV=testing ruby tests/browser_based/run_tests.rb -v
	$(STOP_TEST_SERVER)

production: clean node-modules
	git checkout master
	npm shrinkwrap
	git add .
	git commit -m "rebuild npm-shrinkwrap.json" || true
	npm version patch -m 'deploy to production - version bump to %s'
	git checkout production
	git merge master
	make public-production
	cp .gitignore-production .gitignore
	git add .
	git commit -m 'Update static assets' || true
	git tag -f `$(GET_LATEST_TAG)`

clean:
	compass clean
	rm -rf public/css
	rm -rf public/js/templates.js	
	rm -rf public-build
	rm -rf public-production
	find . -name chromedriver.log -delete


.PHONY: test test-unit test-browser css public-production clean tidy node-modules npm-update npm-shrinkwrap

