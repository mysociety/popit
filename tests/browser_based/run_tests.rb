#!/usr/bin/env ruby

require 'test/unit'

# Change to the directory this file is in, and add it to the load path
Dir.chdir( File.dirname(__FILE__) )
$LOAD_PATH.unshift '.'

# List all the files that we should ignore because they do not contain tests
ignore_files = [
  File.basename(__FILE__),   # this file
]

# get all the ruby files in this directory
test_files = Dir.glob('*.rb')

# remove those that we have chosen to ignore
test_files.reject! { |item| ignore_files.include?( item ) }

# require the remaining so that the unit tests in them are run
test_files.each { |file| require file }
