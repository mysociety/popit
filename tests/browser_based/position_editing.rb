# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/select2_helpers'
require 'pry'
require 'net/http'
require 'uri'


class PositionEditingTests < PopItWatirTestCase

  include Select2Helpers

  def test_position_creation
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type
      goto '/person/george-bush'
      
      def position_form
        return @b.form(:name, "create-new-position")
      end
      
      
      # click on the create new person link and check that the form has popped up    
      assert ! position_form.present?
      @b.link(:text, '+ add a new position').click
      position_form.wait_until_present
      
      # Submit the form and check that it complains about missing title
      position_form.submit
      assert_equal @b.ul(:class, 'error').text, "Title is required"
      
      # click on the title and select President
      select2_container('title').link.click
      assert_equal select2_highlighted_option.text, 'President'
      select2_highlighted_option.click
      assert_equal select2_current_value('title'), 'President'
      
      # click on the org and select us gov
      select2_container('organization').link.click
      assert_equal select2_highlighted_option.text, "United States Government ← select to use existing entry"
      select2_highlighted_option.click
      assert_equal select2_current_value('organization'), "United States Government"
      
      # set the start date, but leave the end date empty
      @b.input(:name, 'start-date').click
      @b.send_keys '2001-01-20'
      assert_equal @b.input(:name, 'start-date').value, '2001-01-20'
      
      # submit the form and check that the new position is created
      position_form.submit
      @b.div(:id, "flash-info").wait_until_present
      
      # check that the correct details have been entered
      assert_match @b.div(:id, "flash-info").ul.text, "New entry 'President' created."
      @b.link(:xpath, "(//a[.='President'])[last()]").click
      assert_equal @b.article.h1.text, "President"
      assert_match @b.text, /Person:\ George\ Bush/
      assert_match @b.text, /Organization:\ United\ States\ Government/
      assert_match @b.text, /Start\ Date:\ 2001-01-20/
      assert_match @b.text, /End\ Date:\ \?\?\?/
          
      # go back to person page and check that the position is now listed there
      goto '/person/george-bush'
      assert_match @b.section(:class, 'positions').text, /President/
      
      # create a new position but with new title and organization
      @b.link(:text, '+ add a new position').click
      position_form.wait_until_present
      
      select2_container('title').link.click
      @b.send_keys 'Bottle Washer'
      assert_equal select2_highlighted_option.text, 'Bottle Washer'
      select2_highlighted_option.click
      assert_equal select2_current_value('title'), 'Bottle Washer'
      
      select2_container('organization').link.click
      @b.send_keys '1600 Penn Hotel'
      assert_equal select2_highlighted_option.text, "1600 Penn Hotel ← select to create new entry"
      select2_highlighted_option.click
      assert_equal select2_current_value('organization'), "1600 Penn Hotel (new entry)"
      
      position_form.submit
      @b.div(:id, "flash-info").wait_until_present
      
      assert_match @b.div(:id, "flash-info").li(:index, 0).text, "New entry '1600 Penn Hotel' created."
      assert_match @b.div(:id, "flash-info").li(:index, 1).text, "New entry 'Bottle Washer' created."
      @b.link(:xpath, "(//a[.='Bottle Washer'])[last()]").click
      assert_equal @b.article.h1.text, "Bottle Washer"
      assert_match @b.text, /Person:\ George\ Bush/
      assert_match @b.text, /Organization:\ 1600\ Penn\ Hotel/
      
      # check that the new title and org are in the possible options
      goto '/person/george-bush'
      @b.link(:text, '+ add a new position').click
      position_form.wait_until_present
      
      select2_container('title').link.click
      assert_equal select2_options(0).text, 'President'
      assert_equal select2_options(1).text, 'Bottle Washer'
      @b.send_keys :escape
      
      select2_container('organization').link.click
      assert_equal select2_options(0).text, "United States Government ← select to use existing entry"
      assert_equal select2_options(1).text, "1600 Penn Hotel ← select to use existing entry"
      @b.send_keys :escape
      
      @b.send_keys :escape
      @b.wait_until { ! position_form.present? }
    }
  end


end
