# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class PersonEditingTests < PopItWatirTestCase

  def test_person_creation_and_editing
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/'

    # try to create new person, get sent to login page
    @b.link(:text, 'Create a new person').click
    assert_match /\login$/, @b.url 

    login_to_instance
    assert_equal 'New Person', @b.title

    # try to enter an empty name
    @b.input(:value, "Create new person").click
    assert_equal 'required', @b.span(:class, 'error').text

    # enter a proper name, get sent to person page
    @b.text_field(:name, 'name').set "Joe Bloggs"
    @b.input(:value, "Create new person").click
    assert_equal "Joe Bloggs", @b.title

    # edit the person
    @b.link(:text, '+ add a summary of this person').click
    @b.text_field(:name, 'summary').set "Test Summary blah blah"
    @b.input(:value, 'Save').click
    assert_equal "Joe Bloggs", @b.title
    assert_match "Test Summary blah blah", @b.text

    # check that this person is in the list of people too
    @b.link(:text, "People").click
    @b.li(:text, "Joe Bloggs").link.click
    assert_equal "Joe Bloggs", @b.title
    
    # create another person with the same slug
    goto '/'
    @b.link(:text, 'Create a new person').click
    @b.text_field(:name, 'name').set "Joé Bloggs"
    @b.input(:value, "Create new person").click
    assert_equal "Joé Bloggs", @b.title
    assert_match /\/joe-bloggs-1$/, @b.url

    # add a person with an unsluggable name
    goto '/'
    @b.link(:text, 'Create a new person').click
    @b.text_field(:name, 'name').set "网页"
    @b.input(:value, "Create new person").click
    assert_match "Can't create one automatically from the name", @b.text
    @b.text_field(:name, 'slug').set "chinese-name"
    @b.input(:value, "Create new person").click
    assert_equal "网页", @b.title
    assert_match /\/chinese-name$/, @b.url

  end

end
