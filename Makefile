
# note - this needs to be default so that the nodeunit process will exit with
# error if tests fail. Otherwise make will not abort.
REPORTER = default 

LINT    = ./node_modules/.bin/jslint --indent 2 --white --nomen
FOREVER = ./node_modules/.bin/forever

WAIT_FOR_SERVER   = sleep 5 # FIXME - use something more elegant
TEST_SERVER = tests/test-server.js
STOP_TEST_SERVER  = $(FOREVER) stop $(TEST_SERVER)
START_TEST_SERVER = $(STOP_TEST_SERVER); NODE_ENV=testing $(FOREVER) start $(TEST_SERVER) && $(WAIT_FOR_SERVER)


all: npm-install scss


npm-install:
	npm install

npm-update:
	rm npm-shrinkwrap.json
	npm update
	npm shrinkwrap


lint:
	find lib          -name '*.js' | xargs -n 1 $(LINT) --node --
	find instance-app -name '*.js' | xargs -n 1 $(LINT) --node --
	find hosting-app  -name '*.js' | xargs -n 1 $(LINT) --node --
	find public/js    -name '*.js' | xargs -n 1 $(LINT) --browser --


scss:
	compass compile


js-templates:
	jade-amd --runtime > public/js/jadeRuntime.js
	rm -rf public/js/templates
	jade-amd --pretty --from instance-app/views --to public/js/templates


minify: scss js-templates
	rm -rf public-production
	node_modules/.bin/r.js -o public/js/app.build.js
	rm    public-production/build.txt
	rm    public-production/js/app.build.js 
	rm -r public-production/sass/
	rm -r public/js/templates	


tidy:
	# this should tidy, but not implemented yet
	# The output is not as nice as I'd like
	# sass-convert --recursive --in-place --from scss --to scss public/sass/


test: npm-install test-unit test-api test-browser

test-unit:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
		--reporter $(REPORTER) \
		tests/unit

test-browser: scss minify
	$(START_TEST_SERVER)
	@NODE_ENV=testing ruby tests/browser_based/run_tests.rb
	$(STOP_TEST_SERVER)

test-api:
	$(STOP_TEST_SERVER)
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
		--reporter $(REPORTER) \
		tests/api

clean:
	compass clean
	rm -rf public-production


.PHONY: test test-unit test-browser test-api scss minify clean tidy npm-install npm-update

