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
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    login_as_instance_owner    

    # goto bush and check he is there
    goto '/organisation/united-states-government'    
    
    check_delete_entity(
      :delete_link_text => '- delete this organisation',
      :form_name        => 'remove-organisation',
    )

  end

  def test_organisation_editing
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/organisation/united-states-government'    

    check_editing_summary

    check_editing_name
  end

end
