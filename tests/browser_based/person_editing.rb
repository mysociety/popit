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
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/persons'

      # check that the create new person link is not shown.
      assert ! add_person_link.present?

      # login and check link is visible
      login_as user_type
      goto '/persons'
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
      @b.input(:value, "Create new person").click
      @b.wait_until { @b.title != 'People' }
      assert_equal "Joe Bloggs", @b.title

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
      @b.wait_until {
        sleep 0.4
        @b.ul(:class, 'suggestions').li.text['No matches']
      }

      # enter dup name and check for suggestions
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "George"
      @b.wait_until {
        # sleep to allow the autocomplete to load and become stable
        sleep 0.4
        @b.ul(:class, 'suggestions').li.text =~ /George Bush/
      }

      # click on a suggestion, check get existing person
      @b.ul(:class, 'suggestions').li.link.click
      assert_path '/persons/george-bush'
      assert_equal @b.title, "George Bush"
      gb_url = @b.url

      # enter dup, create anyway, check for new person
      @b.back
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "George Bush"
      @b.input(:value, "Create new person").click
      @b.wait_until { @b.title != 'People' }
      assert @b.url != gb_url

      # enter name that uses non-ascii characters
      @b.back
      @b.refresh
      add_person_link.click
      @b.text_field(:name, 'name').set "网页"
      @b.input(:value, "Create new person").click
      @b.wait_until { @b.title != 'People' }
      assert_equal "网页", @b.title
    }
  end

  def test_person_deleting
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/'
      login_as user_type
      
      # goto bush and check he is there
      goto '/persons/george-bush'
      
      check_delete_entity(
        :delete_link_text => 'delete this person',
        :form_name        => 'remove-person',
      )
    }
  end

  def test_person_editing
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/persons/george-bush'    
      
      check_editing_summary user_type
      
      check_editing_name
    }
  end

end
