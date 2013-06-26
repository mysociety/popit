# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class PersonContactDetailEditingTests < PopItWatirTestCase

  def test_person_contact_detail_editing
    run_as_all_user_types {
      |user_type|
    
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/'
      login_as user_type
      goto '/person/george-bush'    
      
      # Start to enter a detail and then cancel - check no contact added
      @b.link(:text => '+ add a new contact detail').click
      @b.text_field(:name => 'type').send_keys( 'Ignore' )
      @b.text_field(:name => 'value').send_keys( 'ignore' )
      @b.button(:name => 'cancel').click
      @b.wait_until { ! @b.form(:class => 'bbf-form').present? }
      assert ! @b.element(:text => 'ignore').present?
      @b.refresh
      assert ! @b.element(:text => 'ignore').present?
      
      # Enter a phone number
      @b.link(:text => '+ add a new contact detail').click
      @b.text_field(:name => 'type').send_keys( 'voice')
      @b.text_field(:name => 'value').send_keys( '01234 567 890')
      @b.input(:type => 'submit').click
      
      # Enter an address
      @b.link(:text => '+ add a new contact detail').click
      @b.text_field(:name => 'type').send_keys( 'address' )
      @b.text_field(:name => 'value').send_keys( '1600 Pennsylvania Avenue' )
      @b.input(:name => 'save').click
      
      # Check that the new details are on the page (even after refresh)
      assert @b.element(:text => '01234 567 890').present?
      assert @b.element(:text => '1600 Pennsylvania Avenue').present?
      @b.refresh
      assert @b.element(:text => '01234 567 890').present?
      assert @b.element(:text => '1600 Pennsylvania Avenue').present?
      
      # Edit the phone number
      @b.element(:text => '01234 567 890').click
      @b.text_field(:name => 'value').when_present.set( '11111 222 333')
      @b.input(:name => 'save').click
      @b.wait_until { @b.element(:text => '11111 222 333').present? }
      @b.refresh
      assert @b.element(:text => '11111 222 333').present?
      
      # Edit and then cancel the phone number
      @b.element(:text => '11111 222 333').click
      @b.text_field(:name => 'value').when_present.set( 'should be ignored')
      @b.button(:name => 'cancel').click
      @b.wait_until { @b.element(:text => '11111 222 333').present? }
      @b.refresh
      assert @b.element(:text => '11111 222 333').present?
      
      # check that the autocomplete pops up
      @b.element(:text => '11111 222 333').click
      @b.text_field(:name => 'type').when_present.set( 'a')
      @b.wait_until { @b.li(:class => 'ui-menu-item').present? }
      assert_equal @b.li(:class => 'ui-menu-item').text, 'address'
      @b.li(:class => 'ui-menu-item').link.click
      assert_equal @b.text_field(:name => 'type').value, 'address'
      @b.input(:name => 'save').click
      
      # Delete the phone number
      @b.refresh    
      assert_equal 3, @b.section(:class => 'contact-information').ul.lis.count
      @b.element(:text => '11111 222 333').click
      @b.wait_until { @b.button(:name => 'delete').present? }
      @b.button(:name => 'delete').click
      @b.wait_until { 2 == @b.section(:class => 'contact-information').ul.lis.count }
      assert ! @b.element(:text => '11111 222 333').present?
    }
  end

  def test_person_link_editing
    run_as_all_user_types {
      |user_type|
    
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/'
      login_as user_type
      goto '/person/george-bush'    
      
      # Start to enter a detail and then cancel - check no link added
      @b.link(:text => '+ add a new link').click
      @b.text_field(:name => 'note').send_keys( 'Ignore' )
      @b.text_field(:name => 'url').send_keys( 'ignore' )
      @b.button(:name => 'cancel').click
      @b.wait_until { ! @b.form(:class => 'bbf-form').present? }
      assert ! @b.element(:text => 'ignore').present?
      @b.refresh
      assert ! @b.element(:text => 'ignore').present?
      
      # Enter a wikipedia link
      @b.link(:text => '+ add a new link').click
      @b.text_field(:name => 'note').send_keys( 'Wikipedia' )
      @b.text_field(:name => 'url').send_keys( 'http://en.wikipedia.org/wiki/George_W._Bush' )
      @b.input(:type => 'submit').click
      
      # Enter a WH link
      @b.link(:text => '+ add a new link').click
      @b.text_field(:name => 'note').send_keys( 'White House' )
      @b.text_field(:name => 'url').send_keys( 'http://www.whitehouse.gov/about/presidents/georgehwbush' )
      @b.input(:name => 'save').click
      
      # Check that the new details are on the page (even after refresh)
      assert @b.element(:text => 'Wikipedia:').present?
      assert @b.element(:text => 'http://en.wikipedia.org/wiki/George_W._Bush').present?
      @b.refresh
      assert @b.element(:text => 'Wikipedia:').present?
      assert @b.element(:text => 'http://en.wikipedia.org/wiki/George_W._Bush').present?
      
      # Edit a link
      assert @b.element(:text => 'Wikipedia:').click
      @b.text_field(:name => 'url').when_present.set( 'http://foo.com/')
      @b.input(:name => 'save').click
      @b.wait_until { @b.element(:text => 'http://foo.com/').present? }
      @b.refresh
      assert @b.element(:text => 'http://foo.com/').present?
      
      # Cancel editing a link
      assert @b.element(:text => 'Wikipedia:').click
      @b.text_field(:name => 'url').when_present.set( 'should be ignored')
      @b.button(:name => 'cancel').click
      @b.wait_until { @b.element(:text => 'http://foo.com/').present? }
      @b.refresh
      assert @b.element(:text => 'http://foo.com/').present?
      
      # check that the autocomplete pops up
      assert @b.element(:text => 'Wikipedia:').click
      @b.text_field(:name => 'note').when_present.set( 'wik')
      @b.wait_until { @b.li(:class => 'ui-menu-item').present? }
      assert_equal @b.li(:class => 'ui-menu-item').text, 'Wikipedia'
      @b.li(:class => 'ui-menu-item').link.click
      assert_equal @b.text_field(:name => 'note').value, 'Wikipedia'
      @b.input(:name => 'save').click
      
      assert_equal 3, @b.section(:class => 'links').ul.lis.count
      assert @b.element(:text => 'Wikipedia:').click
      @b.button(:name => 'delete').when_present.click
      @b.wait_until { 2 == @b.section(:class => 'links').ul.lis.count }
      assert ! @b.element(:text => 'http://foo.com/').present?
    }
  end

end
