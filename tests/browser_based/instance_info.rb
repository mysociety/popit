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
    assert_match "Description: Test description",     @b.element(:class => 'about-field-description').text
    assert_match "Region: Test region",               @b.element(:class => 'about-field-region').text
    assert_match "Purpose: Test purpose",             @b.element(:class => 'about-field-purpose').text
    assert_match "Contact Name: Test contact name",   @b.element(:class => 'about-field-contact_name').text
    assert_match "Contact Phone: Test contact phone", @b.element(:class => 'about-field-contact_phone').text
    assert_match "Contact Email: Test contact email", @b.element(:class => 'about-field-contact_email').text


  end

end
