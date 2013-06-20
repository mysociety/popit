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
    @b.li(:class => 'personal_details-date_of_birth').div(:class => 'list-item-value').when_present
  end

  def birth_date_value
    birth_date_div.text
  end

  def test_date_editing
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type

      # open Barack's page
      goto '/person'
      @b.link(:text => 'Barack Obama').click

      # Store the path to the date 
      path_to_date = 'personal_details.date_of_birth'

      # check that there is no current entry
      assert_equal '-', birth_date_value

      # start editing his dob
      birth_date_div.click
      assert_equal 'no date', select2_current_value(path_to_date)

      # enter date and save it, check it is stored.
      select2_container(path_to_date).link.click
      @b.send_keys '4 Aug 1961'
      assert_equal 'Aug 4, 1961', select2_highlighted_option.text
      select2_highlighted_option.click
      assert_equal 'Aug 4, 1961', select2_current_value(path_to_date)
      @b.input(:value => 'Save').click
      assert_equal 'Aug 4, 1961', birth_date_value

      # test that selecting a date and then just clicking save works too
      birth_date_div.click
      @b.input(:value => 'Save').click
      assert_equal 'Aug 4, 1961', birth_date_value

      # test that the user can clear the date
      birth_date_div.click
      select2_click_clear_icon
      @b.input(:value => 'Save').click
      assert_equal '-', birth_date_value

      # check that we can enter a date range
      birth_date_div.click
      select2_container(path_to_date).link.click
      @b.send_keys '1 Jan 1961 to 1961-12-31'
      assert_equal 'Jan 1 - Dec 31, 1961', select2_highlighted_option.text
      select2_highlighted_option.click
      assert_equal 'Jan 1 - Dec 31, 1961', select2_current_value(path_to_date)
      @b.input(:value => 'Save').click
      assert_equal 'Jan 1 - Dec 31, 1961', birth_date_value
    }

  end

end
