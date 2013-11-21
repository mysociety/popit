# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/select2_helpers'
require 'pry'
require 'net/http'
require 'uri'


class MembershipEditingTests < PopItWatirTestCase

  include Select2Helpers

  def edit_link
    @b.execute_script('arguments[0].scrollIntoView();', @b.section(:class, 'memberships'))
    @b.section(:class, 'memberships').li.hover
    @b.section(:class, 'memberships').li.link(:text => 'Edit').click
  end

  def delete_link
    @b.execute_script('arguments[0].scrollIntoView();', @b.section(:class, 'memberships'))
    @b.section(:class, 'memberships').li.hover
    @b.section(:class, 'memberships').li.link(:text => 'Delete').click
  end

  def test_membership_creation
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type
      goto '/persons/george-bush'

      def membership_form
        return @b.form(:name, "edit-membership")
      end

      # click on the create new membership link and check that the form has popped up
      assert ! membership_form.present?
      @b.section(:class, 'memberships').link(:class, 'add').click
      membership_form.wait_until_present

      # Submit the form and check that it complains about missing role
      membership_form.submit
      assert_equal @b.ul(:class, 'error').text, "You must specify a person and an organization."

      # click on the role and select President
      select2_container('role').link.click
      assert_equal select2_highlighted_option.text, 'President'
      select2_highlighted_option.click
      assert_equal select2_current_value('role'), 'President'

      # click on the org and select us gov
      select2_container('organization_id').link.click
      assert_equal select2_highlighted_option.text, "United States Government ← select to use existing entry"
      select2_highlighted_option.click
      assert_equal select2_current_value('organization_id'), "United States Government"

      # set the start date, but leave the end date empty
      @b.input(:name, 'start_date').click
      @b.send_keys '2001-01-20'
      assert_equal @b.input(:name, 'start_date').value, '2001-01-20'

      # submit the form and check that the new membership is created
      membership_form.submit
      @b.wait_until { ! membership_form.present? }
      assert_match /\(President\)\ :\ United\ States\ Government\ \(\ from\ 2001-01-20\ \)/, @b.text

      # go back to person page and check that the membership is now listed there
      goto '/persons/george-bush'
      assert_match /President/, @b.section(:class, 'memberships').text

      # create a new membership but with new role and organization
      @b.section(:class, 'memberships').link(:class, 'add').click
      membership_form.wait_until_present

      select2_container('role').link.click
      @b.send_keys 'Bottle Washer'
      assert_equal select2_highlighted_option.text, 'Bottle Washer'
      select2_highlighted_option.click
      assert_equal select2_current_value('role'), 'Bottle Washer'

      select2_container('organization_id').link.click
      @b.send_keys '1600 Penn Hotel'
      assert_equal select2_highlighted_option.text, "1600 Penn Hotel ← select to create new entry"
      select2_highlighted_option.click
      assert_equal select2_current_value('organization_id'), "1600 Penn Hotel (new entry)"

      membership_form.submit
      @b.wait_until { ! membership_form.present? }
      assert_match /\(Bottle Washer\)\ :\ 1600\ Penn\ Hotel/, @b.text

      # check that the new role and org are in the possible options
      goto '/persons/george-bush'
      @b.section(:class, 'memberships').link(:class, 'add').click
      membership_form.wait_until_present

      select2_container('role').link.click
      assert_equal select2_options(0).text, 'President'
      assert_equal select2_options(1).text, 'Bottle Washer'
      @b.send_keys :escape

      select2_container('organization_id').link.click
      assert_equal select2_options(0).text, "United States Government ← select to use existing entry"
      assert_equal select2_options(1).text, "1600 Penn Hotel ← select to use existing entry"
      @b.send_keys :escape

      @b.send_keys :escape
      @b.wait_until { ! membership_form.present? }
    }
  end

  def test_membership_editing
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type
      goto '/persons/george-bush'

      def membership_form
        return @b.form(:name, "edit-membership")
      end

      # click on the create new membership link and check that the form has popped up
      assert ! membership_form.present?
      edit_link
      membership_form.wait_until_present

      assert_equal select2_current_value('role'), 'President'
      assert_equal select2_current_value('organization_id'), "United States Government"

      # set the start date, but leave the end date empty
      @b.input(:name, 'end_date').click
      @b.send_keys '2013-01-01'
      assert_equal @b.input(:name, 'end_date').value, '2013-01-01'

      membership_form.submit
      @b.wait_until { ! membership_form.present? }
      assert_match /\(President\)\ :\ United\ States\ Government\ \(\ to\ 2013-01-01\ \)/, @b.text
    }
  end

  def test_membership_deletion
    run_as_all_user_types {
      |user_type|
      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      login_as user_type
      goto '/persons/george-bush'

      def membership_form
        return @b.form(:name, "remove-membership")
      end

      # click on the create new membership link and check that the form has popped up
      assert ! membership_form.present?
      delete_link
      membership_form.wait_until_present

      membership_form.submit
      @b.wait_until { ! membership_form.present? }

      assert_no_match /President:\ United\ States\ Government/, @b.text

    }
  end

end
