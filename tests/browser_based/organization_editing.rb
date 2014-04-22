# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/in_place_editing_checks'
require 'lib/entity_create_and_delete'

require 'pry'
require 'net/http'
require 'uri'


class OrganizationEditingTests < PopItWatirTestCase

  include InPlaceEditingChecks
  include EntityCreateAndDelete

  def test_organization_deleting
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type    
      
      # goto bush and check he is there
      goto '/organizations/united-states-government'    
      
      check_delete_entity(
        :delete_link_text => 'delete this organization',
        :form_name        => 'remove-organization',
      )
    }
  end

  def test_organization_editing
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/organizations/united-states-government'    

      check_editing_summary user_type

      check_editing_name
    }
  end

  def test_organization_creation
    def add_organization_link
      @b.link(:text, '+ Add a new organization')
    end
    
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/organizations'

      # check that the create new organization link is not shown.
      assert ! add_organization_link.present?
      
      # login and check link is visible
      login_as user_type
      goto '/organizations'
      assert @b.link(:text, '+ Add a new organization').present?
      
      # click on the create new organization link and check that the form has popped up    
      assert ! @b.form(:name, 'create-new-organization').present?
      add_organization_link.click
      @b.form(:name, 'create-new-organization').wait_until_present
      
      # try to enter an empty name
      @b.input(:value, "Create new organization").click
      assert_equal 'Required', @b.div(:class, 'bbf-help').text
      
      # enter a proper name, get sent to organization page
      @b.text_field(:name, 'name').set "Acme Inc"
      
      @b.input(:value, "Create new organization").click
      @b.wait_until { @b.title != 'Organizations' }
      assert_equal "Acme Inc", @b.title
      
      # check that this organization is in the list of organizations too
      @b.back
      @b.refresh
      @b.li(:text, "Acme Inc").link.click
      assert_equal "Acme Inc", @b.title    
      
      # enter organization check for no suggestions
      @b.back
      @b.refresh
      add_organization_link.click
      @b.text_field(:name, 'name').set "I'm a unique name"
      @b.wait_until {
        sleep 0.4
        @b.ul(:class, 'suggestions').li.text == 'No matches'
      }
      
      # enter dup name and check for suggestions
      @b.refresh
      add_organization_link.click
      @b.text_field(:name, 'name').set "United"
      @b.wait_until {
        # DOM changes alot, wait for it to settle before inspecting
        sleep 0.4
        @b.ul(:class, 'suggestions').li.text =~ /United States Government/
      }
      
      # click on a suggestion, check get existing organization
      @b.ul(:class, 'suggestions').li.link.click
      assert_path '/organizations/united-states-government'
      usg_url = @b.url
      
      # enter dup, create anyway, check for new organization
      @b.back
      @b.refresh
      add_organization_link.click
      @b.text_field(:name, 'name').set "United States Government"
      @b.input(:value, "Create new organization").click
      @b.wait_until { @b.title != 'Organizations' }
      assert @b.url != usg_url
      
      # enter name that uses non-ascii characters
      @b.back
      @b.refresh
      add_organization_link.click
      @b.text_field(:name, 'name').set "网页"
      @b.input(:value, "Create new organization").click
      @b.wait_until { @b.title != 'Organizations' }
      assert_equal "网页", @b.title

      # check edits are kept
      @b.back
      @b.refresh
      add_organization_link.click
      @b.text_field(:name, 'name').set 'Test'
      @b.input(:value, "Create new organization").click
      @b.wait_until { sleep 0.4; @b.link(:class => 'other_name-edit').present? }

      # Add an alternative name
      @b.element(:css, '.other_name-edit').click
      alternative_name_input = @b.element(:css, '.other_names').input(:name, 'name')
      @b.wait_until { sleep 0.4; alternative_name_input.present? }
      alternative_name_input.send_keys("Some alternative name", :enter)

      # Change the organization name
      name_element = @b.element(:css, '#entity-name-in-header')
      name_element.click
      name_element.element(:css, 'input').send_keys("Bar Test", :enter)
      @b.refresh

      # The alternative name should be preserved
      assert_match /Some alternative name/, @b.element(:css, '.other_names').text
    }
  end

end
