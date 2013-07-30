# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/select2_helpers'

require 'pry'
require 'net/http'
require 'uri'


class DateEditingTests < PopItWatirTestCase

  include Select2Helpers

  def birth_date_div
    @b.li(:class => 'personal_details-birth_date').span(:class => 'list-item-value').when_present
  end

  def birth_date_value
    birth_date_div.text
  end

  def birth_date_input
    birth_date_div.text_field(:name => 'value')
  end

  def test_date_editing
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type

      # open Barack's page
      goto '/persons'
      @b.link(:text => 'Barack Obama').click

      # Store the path to the date 
      path_to_date = 'birth_date'

      # check that there is no current entry
      assert_equal '---', birth_date_value

      # start editing his dob
      birth_date_div.click
      assert_equal '', birth_date_input.value

      # enter date and save it, check it is stored.
      birth_date_input.click
      birth_date_input.set '1961-08-04'
      @b.send_keys :return
      assert_equal '1961-08-04', birth_date_value

      # test that selecting a date and then just clicking save works too
      birth_date_div.click
      @b.send_keys :return
      assert_equal '1961-08-04', birth_date_value

      # test that the user can clear the date
      birth_date_div.click
      birth_date_input.set ''
      @b.send_keys :return
      assert_equal '---', birth_date_value
    }

  end

end
