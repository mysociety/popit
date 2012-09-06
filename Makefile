
# note - this needs to be default so that the nodeunit process will exit with
# error if tests fail. Otherwise make will not abort.
REPORTER = default 

LINT    = ./node_modules/.bin/jslint --indent 2 --white --nomen
FOREVER = ./node_modules/.bin/forever

WAIT_FOR_SERVER   = sleep 5
TEST_SERVER = tests/test-server.js
STOP_TEST_SERVER  = $(FOREVER) stop $(TEST_SERVER)
START_TEST_SERVER = $(STOP_TEST_SERVER); NODE_ENV=testing $(FOREVER) start $(TEST_SERVER) && $(WAIT_FOR_SERVER)


all: node-modules css


node-modules:
	npm install
	npm prune

npm-update:
	rm npm-shrinkwrap.json
	npm install
	npm update
	npm prune
	npm shrinkwrap

npm-shrinkwrap:
	npm install
	rm npm-shrinkwrap.json
	npm install
	npm prune
	npm shrinkwrap


lint:
	find lib          -name '*.js' | xargs -n 1 $(LINT) --node --
	find instance-app -name '*.js' | xargs -n 1 $(LINT) --node --
	find hosting-app  -name '*.js' | xargs -n 1 $(LINT) --node --
	find public/js    -name '*.js' | xargs -n 1 $(LINT) --browser --


css:
	compass compile
	cp -r public/sass/jqueryui/images public/css/


optipng:
	find public -name '*.png' | xargs optipng --clobber -o4


js-templates:
	node_modules/.bin/jade-amd --runtime > public/js/jadeRuntime.js
	rm -rf public/js/templates
	node_modules/.bin/jade-amd --pretty --from instance-app/views --to public/js/templates


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
	rm -r public/js/templates	


tidy:
	# this should tidy, but not implemented yet
	# The output is not as nice as I'd like
	# sass-convert --recursive --in-place --from scss --to scss public/sass/


test: node-modules test-unit test-api test-browser
	echo "ALL TESTS PASS"

test-unit:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
	  --reporter $(REPORTER) \
	  tests/unit

test-browser: css public-production
	$(START_TEST_SERVER)
	@NODE_ENV=testing ruby tests/browser_based/run_tests.rb -v
	$(STOP_TEST_SERVER)

test-api:
	$(STOP_TEST_SERVER)
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
	  --reporter $(REPORTER) \
	  tests/api


production: clean
	git checkout production
	git merge master
	make public-production
	git st
	echo "Ready to commit now"

clean:
	compass clean
	rm -rf public/css
	rm -rf public/js/templates	
	rm -rf public-build
	rm -rf public-production
	find . -name chromedriver.log -delete


.PHONY: test test-unit test-browser test-api css public-production clean tidy node-modules npm-update npm-shrinkwrap

