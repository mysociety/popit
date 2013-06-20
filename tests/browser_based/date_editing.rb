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

  def birth_date_value
    @b.li(:class => 'personal_details-date_of_birth').div(:class => 'list-item-value').when_present.text
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
      assert_equal '??', birth_date_value

      # start editing his dob
      @b.link(:text => 'edit this date').click
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
      @b.link(:text => 'edit this date').click
      @b.input(:value => 'Save').click
      assert_equal 'Aug 4, 1961', birth_date_value

      # test that the user can clear the date
      @b.link(:text => 'edit this date').click
      select2_click_clear_icon
      @b.input(:value => 'Save').click
      assert_equal '??', birth_date_value

      # check that we can enter a date range
      @b.link(:text => 'edit this date').click
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
