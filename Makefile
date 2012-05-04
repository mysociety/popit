
REPORTER = verbose

test: test-unit test-selenium

test-unit:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
		--reporter $(REPORTER) \
		tests/unit

test-selenium:
	@NODE_ENV=testing ./node_modules/.bin/nodeunit \
		--reporter $(REPORTER) \
		tests/selenium

.PHONY: test test-unit test-selenium

