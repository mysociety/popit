
JSHINT = ./node_modules/.bin/jshint

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
	$(JSHINT) *.js lib/ hosting-app/ instance-app/ test/
	cd public/js; ../../$(JSHINT) .

css:
	compass compile
	cp -r public/sass/jqueryui/images public/css/
	cp -r public/sass/select2/select2.png public/css/
	cp -r public/sass/select2/select2x2.png public/css/
	cp -r public/sass/select2/spinner.gif public/css/


optipng:
	find public -name '*.png' | xargs optipng --clobber -o4

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


tidy:
	# this should tidy, but not implemented yet
	# The output is not as nice as I'd like
	# sass-convert --recursive --in-place --from scss --to scss public/sass/


test: node-modules jshint test-unit
	@echo "ALL TESTS PASS"

test-unit:
	@NODE_ENV=testing ./node_modules/.bin/mocha --recursive

clean:
	compass clean
	rm -rf public/css
	rm -rf public-build
	rm -rf public-production
	find . -name chromedriver.log -delete


.PHONY: test test-unit css public-production clean tidy node-modules npm-update npm-shrinkwrap

