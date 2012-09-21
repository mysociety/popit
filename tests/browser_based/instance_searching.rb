# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'popit_watir_test_case'
require 'pry'


class InstanceSearchingTests < PopItWatirTestCase

  def search_input
    @b.input(:id, 'header_search_box')
  end

  def search_form
    @b.form(:id, 'header_search_form')
  end

  def test_empty_search
      delete_instance 'test'
      goto_instance 'test'
      load_test_fixture
      goto '/'

      search_input.click
      @b.send_keys ''
      search_form.submit
      
      assert_match @b.text, /Sorry, no results/
  end    

  def test_single_result_search
      delete_instance 'test'
      goto_instance 'test'
      load_test_fixture
      goto '/'

      search_input.click
      @b.send_keys 'Clinton'
      search_form.submit
      
      # only one result should redirect straight to the result
      assert_match @b.url, /\/person\/bill-clinton/
  end    

  def test_multi_result_search
      delete_instance 'test'
      goto_instance 'test'
      load_test_fixture
      goto '/'

      search_input.click
      @b.send_keys 'George'
      search_form.submit
      
      assert_match @b.url, /\/search/
      assert @b.link(:text, "George Bush").present?
      assert @b.link(:text, "George W. Bush").present?
  end
  
  def test_near_match_search
      delete_instance 'test'
      goto_instance 'test'
      load_test_fixture
      goto '/'

      search_input.click
      @b.send_keys 'Bash'  # note the 'a' instead of 'u'
      search_form.submit
      
      assert_match @b.url, /\/search/
      assert @b.link(:text, "George Bush").present?
      assert @b.link(:text, "George W. Bush").present?
  end
  
end
