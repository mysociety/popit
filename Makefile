
REPORTER = verbose

all: scss

scss:
	compass compile


tidy:
	# this should tidy, but not implemented yet
	# The output is not as nice as I'd like
	# sass-convert --recursive --in-place --from scss --to scss public/sass/


test: test-unit test-selenium

test-unit:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
		--reporter $(REPORTER) \
		tests/unit

test-selenium:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
		--reporter $(REPORTER) \
		tests/selenium



clean:
	rm -rf .sass-cache




.PHONY: test test-unit test-selenium scss clean tidy

