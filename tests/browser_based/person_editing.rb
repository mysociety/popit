# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/in_place_editing_checks'
require 'lib/entity_create_and_delete'

require 'pry'
require 'net/http'
require 'uri'


class PersonEditingTests < PopItWatirTestCase

  include InPlaceEditingChecks
  include EntityCreateAndDelete

  def add_person_link
    @b.link(:text, '+ Add a new person')
  end

  def test_person_creation
    run_as_guest_and_owner {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/person'

      # check that the create new person link is not shown. But that it is if the
      # user hovers over the sign in link
      assert ! add_person_link.present?
      @b.link(:id, "sign_in_as_existing_user").hover

      assert add_person_link.present?

      # login and check link is visible
      login_as user_type
      goto '/person'
      assert @b.link(:text, '+ Add a new person').present?

      # click on the create new person link and check that the form has popped up    
      assert ! @b.form(:name, 'create-new-person').present?
      add_person_link.click
      @b.form(:name, 'create-new-person').wait_until_present

      # try to enter an empty name
      @b.input(:value, "Create new person").click
      assert_equal 'Required', @b.div(:class, 'bbf-help').text

      # enter a proper name, get sent to person page
      @b.text_field(:name, 'name').set "Joe Bloggs"
      assert_equal "joe-bloggs", @b.text_field(:name, 'slug').value

      @b.input(:value, "Create new person").click
      @b.wait_until { @b.title != 'People' }
      assert_equal "Joe Bloggs", @b.title
      assert_path '/person/joe-bloggs'

      # check that this person is in the list of people too
      @b.back
      @b.refresh
      @b.li(:text, "Joe Bloggs").link.click
      assert_equal "Joe Bloggs", @b.title    

      # enter person check for no suggestions
      @b.back
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "I'm a unique name"
      assert_equal 'No matches', @b.ul(:class, 'suggestions').li.text

      # enter dup name and check for suggestions
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "George"
      @b.wait_until { @b.ul(:class, 'suggestions').present? && @b.ul(:class, 'suggestions').li.text['George Bush'] }

      # click on a suggestion, check get existing person
      @b.ul(:class, 'suggestions').li.link.click
      assert_path '/person/george-bush'

      # enter dup, create anyway, check for new person
      @b.back
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "George Bush"
      @b.input(:value, "Create new person").click
      @b.wait_until { @b.title != 'People' }
      assert_path '/person/george-bush-1'

      # enter name that can't be slugged
      @b.back
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "网页"
      assert_equal "", @b.text_field(:name, 'slug').value
      @b.input(:value, "Create new person").click
      assert_equal 'Required', @b.div(:class =>'bbf-help', :index => 1 ).text
      @b.text_field(:name, 'slug').set 'chinese-name'
      @b.input(:value, "Create new person").click
      @b.wait_until { @b.title != 'People' }
      assert_equal "网页", @b.title
      assert_path '/person/chinese-name'
    }    
  end

  def test_person_deleting
    run_as_guest_and_owner {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/'
      login_as user_type
      
      # goto bush and check he is there
      goto '/person/george-bush'
      
      check_delete_entity(
        :delete_link_text => '- delete this person',
        :form_name        => 'remove-person',
      )
    }
  end

  def test_person_editing
    run_as_guest_and_owner {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/person/george-bush'    
      
      check_editing_summary user_type
      
      check_editing_name
    }
  end

end
