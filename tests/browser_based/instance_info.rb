# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InstanceInfoTests < PopItWatirTestCase

  def test_about_page_instance
    goto_instance 'test'
    delete_instance_database
    load_test_fixture

    goto '/about'
    assert_equal 'About Us', @b.title

    # check that the about us details are empty (ie that settings have been
    # cleared as part of database deleteing)
    assert_equal 'Description:', @b.element(:class => 'about-field-description').text

    # Check that the edit link is not displayed
    assert ! @b.link(:text, '(edit)').present?
    
    # check that we can't access edit page if not logged in
    goto '/about/edit'
    assert_match /\/login$/, @b.url
    
    # login and check if edit link is visible
    login_to_instance
    goto '/about'
    assert @b.link(:text, '(edit)').present?

    # click on the create new person link and check that the form has popped up
    assert ! @b.form(:name, 'edit-about-info').present?
    @b.link(:text, '(edit)').click
    @b.form(:name, 'edit-about-info').wait_until_present

    # enter field values and submit
    @b.text_field(:name, 'description').set "Test description"
    @b.text_field(:name, 'region').set "Test region"
    @b.text_field(:name, 'purpose').set "Test purpose"
    @b.text_field(:name, 'contact_name').set "Test contact name"
    @b.text_field(:name, 'contact_email').set "Test contact email"
    @b.text_field(:name, 'contact_phone').set "Test contact phone"
    @b.input(:value, "Update Info").click

    # check that the entries are as expected
    assert_match /\/about$/, @b.url
    assert_equal "Description: Test description",     @b.element(:class => 'about-field-description').text
    assert_equal "Region: Test region",               @b.element(:class => 'about-field-region').text
    assert_equal "Purpose: Test purpose",             @b.element(:class => 'about-field-purpose').text
    assert_equal "Contact Name: Test contact name",   @b.element(:class => 'about-field-contact_name').text
    assert_equal "Contact Phone: Test contact phone", @b.element(:class => 'about-field-contact_phone').text
    assert_equal "Contact Email: Test contact email", @b.element(:class => 'about-field-contact_email').text

    # Go to the hosting site and browse the instances available
    goto_hosting_site
    @b.link(:text, 'Browse existing sites').click
    assert_match /\/instances$/, @b.url
    assert_equal "Instance Directory", @b.title

    # Check that just the slug is shown for the test instance and that minimal
    # details are on the instance page
    assert_equal 'test', @b.link(:id, 'instance-test').text
    @b.link(:id, 'instance-test').click
    assert_equal 'test', @b.title
    assert_match /no more details/, @b.text

    # Fetch all the instance data and then check that the details are correctly
    # presented.
    

    binding.pry

    # # This will be enabled after adding sync
    # # assert_match( "test - Test description", @b.text )

  end

end
