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
    goto '/about'
    assert_equal 'About Us', @b.title

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
    assert_equal "Test description", @b.text_field(:name, 'description').value

    @b.text_field(:name, 'region').set "Test region"
    assert_equal "Test region", @b.text_field(:name, 'region').value

    @b.text_field(:name, 'purpose').set "Test purpose"
    assert_equal "Test purpose", @b.text_field(:name, 'purpose').value

    @b.text_field(:name, 'contact_name').set "Test contact name"
    assert_equal "Test contact name", @b.text_field(:name, 'contact_name').value

    @b.text_field(:name, 'contact_email').set "Test contact email"
    assert_equal "Test contact email", @b.text_field(:name, 'contact_email').value

    @b.text_field(:name, 'contact_phone').set "Test contact phone"
    assert_equal "Test contact phone", @b.text_field(:name, 'contact_phone').value

    @b.input(:value, "Update Info").click
    goto '/about'
    assert_match "Description: Test description", @b.text
    assert_match "Purpose: Test purpose", @b.text
    assert_match "Contact Name: Test contact name", @b.text
    assert_match "Contact Phone: Test contact phone", @b.text
    assert_match "Contact Email: Test contact email", @b.text
  end

  def test_instances_page_hosting
    goto_hosting_site
    goto '/instances'
    assert_equal "Instance Directory", @b.title

    # This will be enabled after adding sync
    # assert_match( "test - Test description", @b.text )
  end

end
