# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'lib/in_place_editing_checks'
require 'pry'
require 'net/http'
require 'uri'


class OrganisationEditingTests < PopItWatirTestCase

  include InPlaceEditingChecks

  def test_organisation_editing
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/organisation/united-states-government'    

    check_editing_summary

    check_editing_name
  end

end
