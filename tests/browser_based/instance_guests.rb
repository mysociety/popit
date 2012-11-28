# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InstanceGuestTests < PopItWatirTestCase

  def test_enabling_and_disabling_guest_access
    goto_instance 'test'
    delete_instance_database
    load_test_fixture

    # check that the instance starts with guest access turned off
    goto '/'
    assert_equal "Authorised edits only", @b.element(:id => 'instance_guest_status').text
    
    # enable guest access and check again
    enable_guest_access
    goto '/'
    assert_equal "Guest edits allowed", @b.element(:id => 'instance_guest_status').text

    # and off again
    disable_guest_access
    goto '/'
    assert_equal "Authorised edits only", @b.element(:id => 'instance_guest_status').text

  end 

end
