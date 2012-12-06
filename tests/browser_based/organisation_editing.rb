# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/in_place_editing_checks'
require 'lib/entity_create_and_delete'

require 'pry'
require 'net/http'
require 'uri'


class OrganisationEditingTests < PopItWatirTestCase

  include InPlaceEditingChecks
  include EntityCreateAndDelete

  def test_organisation_deleting
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type    
      
      # goto bush and check he is there
      goto '/organisation/united-states-government'    
      
      check_delete_entity(
        :delete_link_text => '- delete this organisation',
        :form_name        => 'remove-organisation',
      )
    }
  end

  def test_organisation_editing
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/organisation/united-states-government'    

      check_editing_summary user_type

      check_editing_name
    }
  end

  def test_organisation_creation
    def add_organisation_link
      @b.link(:text, '+ Add a new organisation')
    end
    
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/organisation'

      # check that the create new organisation link is not shown. But that it is if the
      # user hovers over the sign in link
      assert ! add_organisation_link.present?
      @b.link(:id, "sign_in_as_existing_user").hover
      
      assert add_organisation_link.present?
      
      # login and check link is visible
      login_as user_type
      goto '/organisation'
      assert @b.link(:text, '+ Add a new organisation').present?
      
      # click on the create new organisation link and check that the form has popped up    
      assert ! @b.form(:name, 'create-new-organisation').present?
      add_organisation_link.click
      @b.form(:name, 'create-new-organisation').wait_until_present
      
      # try to enter an empty name
      @b.input(:value, "Create new organisation").click
      assert_equal 'Required', @b.div(:class, 'bbf-help').text
      
      # enter a proper name, get sent to organisation page
      @b.text_field(:name, 'name').set "Acme Inc"
      assert_equal "acme-inc", @b.text_field(:name, 'slug').value
      
      @b.input(:value, "Create new organisation").click
      @b.wait_until { @b.title != 'Organisations' }
      assert_equal "Acme Inc", @b.title
      assert_path '/organisation/acme-inc'
      
      # check that this organisation is in the list of organisations too
      @b.back
      @b.refresh
      @b.li(:text, "Acme Inc").link.click
      assert_equal "Acme Inc", @b.title    
      
      # enter organisation check for no suggestions
      @b.back
      @b.refresh
      add_organisation_link.click
      @b.text_field(:name, 'name').set "I'm a unique name"
      @b.wait_until {
        sleep 0.4
        @b.ul(:class, 'suggestions').li.text == 'No matches'
      }
      
      # enter dup name and check for suggestions
      @b.refresh
      add_organisation_link.click
      @b.text_field(:name, 'name').set "United"
      @b.wait_until {
        # DOM changes alot, wait for it to settle before inspecting
        sleep 0.4
        @b.ul(:class, 'suggestions').li.text =~ /United States Government/
      }
      
      # click on a suggestion, check get existing organisation
      @b.ul(:class, 'suggestions').li.link.click
      assert_path '/organisation/united-states-government'
      
      # enter dup, create anyway, check for new organisation
      @b.back
      @b.refresh
      add_organisation_link.click
      @b.text_field(:name, 'name').set "United States Government"
      @b.input(:value, "Create new organisation").click
      @b.wait_until { @b.title != 'Organisations' }
      assert_path '/organisation/united-states-government-1'
      
      # enter name that can't be slugged
      @b.back
      @b.refresh
      add_organisation_link.click
      @b.text_field(:name, 'name').set "网页"
      assert_equal "", @b.text_field(:name, 'slug').value
      @b.input(:value, "Create new organisation").click
      @b.wait_until{ @b.div(:class =>'bbf-help', :index => 1 ).present? }
      assert_equal 'Required', @b.div(:class =>'bbf-help', :index => 1 ).text
      @b.text_field(:name, 'slug').set 'chinese-name'
      @b.input(:value, "Create new organisation").click
      @b.wait_until { @b.title != 'Organisations' }
      assert_equal "网页", @b.title
      assert_path '/organisation/chinese-name'
    }
  end

end
