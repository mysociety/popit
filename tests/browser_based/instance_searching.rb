# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'pry'


class InstanceSearchingTests < PopItWatirTestCase

  def prep_for_test
    delete_instance 'test'
    goto_instance 'test'
    load_test_fixture
    goto '/'
  end

  def run_search (term)
    @b.text_field(:id, 'header_search_box').set term
    @b.send_keys :enter

    # wait for the search to run - checking to see that the search box is
    # empty is one waf to do this.
    @b.wait_until { @b.text_field(:id, 'header_search_box').text == '' }
  end

  ######################

  def test_empty_search
    prep_for_test
    run_search ''
    assert_match /Sorry, no results/, @b.text
  end    

  def test_single_result_search
    prep_for_test
    run_search 'Clinton'      
    # only one result should redirect straight to the result
    assert_path '/persons/bill-clinton'
  end    

  def test_multi_result_search
    prep_for_test
    run_search 'George'
    
    assert_path '/search'
    assert @b.link(:text, "George Bush").present?
    assert @b.link(:text, "George W. Bush").present?
  end
  
  def test_near_match_search
    prep_for_test
    run_search 'Bash'  # note the 'a' instead of 'u'
    
    assert_path '/search'
    assert @b.link(:text, "George Bush").present?
    assert @b.link(:text, "George W. Bush").present?
  end
  
end
