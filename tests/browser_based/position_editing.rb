# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class PositionEditingTests < PopItWatirTestCase

  def test_position_creation
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    login_as_instance_owner
    goto '/person/george-bush'
  
    def position_form
      return @b.form(:name, "create-new-position")
    end
    
    def select2_container ( input_name )
      @b.input(:name, input_name).parent.div(:class, "select2-container").when_present
    end
    
    def select2_current_value ( input_name )
      select2_container(input_name).link(:class, 'select2-choice').span.text
    end
    
    def select2_options ( index )
      @b.li(:class => 'select2-result', :index => index ).when_present
    end
    
    def select2_highlighted_option
      return @b.li(:class, "select2-highlighted").when_present
    end
    
  
    # click on the create new person link and check that the form has popped up    
    assert ! position_form.present?
    @b.link(:text, '+ add a new position').click
    position_form.wait_until_present
  
    # Submit the form and check that it complains about missing title
    position_form.submit
    assert_equal @b.ul(:class, 'error').text, "Title is required"
    
    # click on the title and select President
    select2_container('title').click
    assert_equal select2_highlighted_option.text, 'President'
    select2_highlighted_option.click
    assert_equal select2_current_value('title'), 'President'

    # click on the org and select us gov
    select2_container('organisation').click
    assert_equal select2_highlighted_option.text, "United States Government ← select to use existing entry"
    select2_highlighted_option.click
    assert_equal select2_current_value('organisation'), "United States Government"
    

    # submit the form and check that the new position is created
    position_form.submit
    @b.wait_until { @b.url['position'] }

    # check that the correct details have been entered
    assert_match @b.div(:id, "flash-info").ul.text, "New entry 'President' created."
    assert_equal @b.article.h1.text, "President"
    assert_match @b.text, /Person:\ George\ Bush/
    assert_match @b.text, /Organisation:\ United\ States\ Government/
        
    # go back to person page and check that the positien is now listed there
    goto '/person/george-bush'
    assert_match @b.section(:class, 'positions').text, /President/

    # create a new position but with new title and organisation
    @b.link(:text, '+ add a new position').click
    position_form.wait_until_present

    select2_container('title').click
    @b.send_keys 'Bottle Washer'
    assert_equal select2_highlighted_option.text, 'Bottle Washer'
    select2_highlighted_option.click
    assert_equal select2_current_value('title'), 'Bottle Washer'

    select2_container('organisation').click
    @b.send_keys '1600 Penn Hotel'
    assert_equal select2_highlighted_option.text, "1600 Penn Hotel ← select to create new entry"
    select2_highlighted_option.click
    assert_equal select2_current_value('organisation'), "1600 Penn Hotel (new entry)"
    
    position_form.submit
    @b.wait_until { @b.url['position'] }

    assert_match @b.div(:id, "flash-info").li(:index, 0).text, "New entry '1600 Penn Hotel' created."
    assert_match @b.div(:id, "flash-info").li(:index, 1).text, "New entry 'Bottle Washer' created."
    assert_equal @b.article.h1.text, "Bottle Washer"
    assert_match @b.text, /Person:\ George\ Bush/
    assert_match @b.text, /Organisation:\ 1600\ Penn\ Hotel/

    # check that the new title and org are in the possible options
    goto '/person/george-bush'
    @b.link(:text, '+ add a new position').click
    position_form.wait_until_present

    select2_container('title').click
    assert_equal select2_options(0).text, 'President'
    assert_equal select2_options(1).text, 'Bottle Washer'
    @b.send_keys :escape

    select2_container('organisation').click
    assert_equal select2_options(0).text, "United States Government ← select to use existing entry"
    assert_equal select2_options(1).text, "1600 Penn Hotel ← select to use existing entry"
    @b.send_keys :escape

    @b.send_keys :escape
    @b.wait_until { ! position_form.present? }

  end


end
