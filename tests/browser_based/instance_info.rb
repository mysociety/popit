# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InstanceInfoTests < PopItWatirTestCase

  def test_about_page_instance

    delete_instance 'test'
    goto_instance 'test'
    load_test_fixture
    
    # check that the site title is the slug
    goto '/'
    assert_equal @b.header.h1.text, 'test'
    assert_equal @b.title, 'test'

    # check that the about us details are empty (ie that settings have been
    # cleared as part of database deleteing)
    goto '/about'
    assert_equal 'About Us', @b.title
    assert_equal 'Description:', @b.element(:class => 'about-field-description').text

    # Check that the edit link is not displayed
    assert ! @b.link(:text, '(edit)').present?
    
    # check that we can't access edit page if not logged in
    goto '/about/edit'
    assert_path '/login'
    
    # login and check if edit link is visible
    login_as_instance_owner
    goto '/about'
    assert @b.link(:text, '(edit)').present?

    # click on the edit link and check that the form has popped up
    assert ! @b.form(:name, 'edit-about-info').present?
    @b.link(:text, '(edit)').click
    @b.form(:name, 'edit-about-info').wait_until_present

    # enter field values and submit
    @b.text_field(:name, 'name').set "Test Name"
    @b.text_field(:name, 'description').set "Test description"
    @b.text_field(:name, 'region').set "Test region"
    @b.text_field(:name, 'purpose').set "Test purpose"
    @b.text_field(:name, 'contact_name').set "Test contact name"
    @b.text_field(:name, 'contact_email').set "Test contact email"
    @b.text_field(:name, 'contact_phone').set "Test contact phone"
    @b.input(:value, "Update Info").click

    # check that the entries are as expected
    assert_path '/about'
    assert_equal "Name: Test Name",                   @b.element(:class => 'about-field-name').text
    assert_equal "Description: Test description",     @b.element(:class => 'about-field-description').text
    assert_equal "Region: Test region",               @b.element(:class => 'about-field-region').text
    assert_equal "Purpose: Test purpose",             @b.element(:class => 'about-field-purpose').text
    assert_equal "Contact Name: Test contact name",   @b.element(:class => 'about-field-contact_name').text
    assert_equal "Contact Phone: Test contact phone", @b.element(:class => 'about-field-contact_phone').text
    assert_equal "Contact Email: Test contact email", @b.element(:class => 'about-field-contact_email').text

    # check that the site title is now the site name
    goto '/'
    assert_equal @b.header.h1.text, 'Test Name'
    assert_equal @b.title, 'Test Name'
    

    # Go to the hosting site and browse the instances available
    goto_hosting_site
    @b.link(:text, 'Browse existing sites').click
    assert_path '/instances'
    assert_equal "Instance Directory", @b.title

    # Check that just the slug is shown for the test instance and that minimal
    # details are on the instance page
    assert_equal 'test', @b.link(:id, 'instance-test').text
    @b.link(:id, 'instance-test').click
    assert_equal 'test', @b.title

    # Fetch all the instance data and then check that the details are correctly
    # presented.
    fetch_all_active_instance_info
    goto '/'
    @b.link(:text, 'Browse existing sites').click
    assert_equal 'Test Name', @b.link(:id, 'instance-test').text
    @b.link(:id, 'instance-test').click
    assert_equal 'Test Name', @b.title
    assert_match /Test description/, @b.text

    # Check that the link to the instance works
    @b.link(:text, /^http:\/\/test\./).click
    assert_match /^http:\/\/test\./, @b.url

  end

end
