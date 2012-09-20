require 'test/unit'

# make it possible to load the test cases from the local directory
$:.unshift File.dirname(__FILE__)

# FIXME - should not need to list all the tests here - should be able to extract them from the directory listing instead.

require 'basics'
require 'hosting'
require 'info_pages'
require 'instance'
require 'instance_auth'
require 'instance_info'
require 'migration'
require 'person_editing'
require 'person_edit_list_details'
require 'person_photo'
require 'position_editing'
