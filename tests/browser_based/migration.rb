# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'test/unit'

# make it possible to load the test cases from the local directory
$:.unshift File.dirname(__FILE__)

require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class MigrationTests < PopItWatirTestCase

  def test_migration_page_exists
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/migration/'

    # try to open migration tool, get sent to login page
    assert_match /\login$/, @b.url 

    login_as_instance_owner
    assert_equal 'Migration Tool', @b.title
  end

  def test_migration_utf8_csv
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/migration/'
    login_as_instance_owner

    assert_equal 'Migration Tool', @b.title

    # upload test file
    @b.file_field(:name => 'source').set( File.join( File.dirname(__FILE__), 'migration_sample.csv') )
    @b.input(:type => 'submit').click

    # define the mapping
    assert_equal 'Define Mapping', @b.h1(:id => "mapping").text
    
    # set all the selects
    @b.select_list(:xpath, "//tr[@id='id_Name']//select").select("Name, birthday & similar")
    @b.select_list(:xpath, "//tr[@id='id_Name']//select[@name='db-attribute']").select("Full name")

    @b.select_list(:xpath, "//tr[@id='id_Email']//select").select("Contact Information")
    @b.text_field(:xpath, "//tr[@id='id_Email']//input[@name='db-attribute']").set("Email")

    @b.select_list(:xpath, "//tr[@id='id_Party']//select").select("Position")
    @b.text_field(:xpath, "//tr[@id='id_Party']//input[@name='db-attribute']").set("Party")

    @b.select_list(:xpath, "//tr[@id='id_Date_of_Birth']//select").select("Name, birthday & similar")
    @b.select_list(:xpath, "//tr[@id='id_Date_of_Birth']//select[@name='db-attribute']").select("Birthday")

    @b.select_list(:xpath, "//tr[@id='id_PopitID']//select").select("ID")
    @b.text_field(:xpath, "//tr[@id='id_PopitID']//input[@name='db-attribute']").set("PopIt")

    @b.select_list(:xpath, "//tr[@id='id_University']//select").select("Other data")
    @b.text_field(:xpath, "//tr[@id='id_University']//input[@name='db-attribute']").set("University")

    @b.select_list(:xpath, "//tr[@id='id_URL']//select").select("Link")
    @b.text_field(:xpath, "//tr[@id='id_URL']//input[@name='db-attribute']").set("Url")

    # start migration
    @b.input(:type => 'submit').click

    assert_equal 'Status of Migration', @b.h1(:id => "status").text

    # wait for successful completion
    @b.link(:id => "_finished").wait_until_present
    assert_equal '2', @b.link(:id => "_finished").text

    # check that the names are there correctly
    @b.link(:id => "_finished").click
    assert @b.url['/person']
    assert @b.text['Joe Bloggs']
    assert @b.text['D’Angelo “Oddball” Fritz']

  end
  
  def test_migration_win1252_csv
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/migration/'
    login_as_instance_owner

    assert_equal 'Migration Tool', @b.title

    # upload test file
    @b.file_field(:name => 'source').set( File.join( File.dirname(__FILE__), 'migration_sample_win1252.csv') )
    @b.input(:type => 'submit').click

    # define the mapping
    assert_equal 'Define Mapping', @b.h1(:id => "mapping").text
    
    # set all the selects
    @b.select_list(:xpath, "//tr[@id='id_name']//select").select("Name, birthday & similar")
    @b.select_list(:xpath, "//tr[@id='id_name']//select[@name='db-attribute']").select("Full name")

    # start migration
    @b.input(:type => 'submit').click

    # wait for successful completion
    assert_equal 'Status of Migration', @b.h1(:id => "status").text
    @b.link(:id => "_finished").wait_until_present
    assert_equal '2', @b.link(:id => "_finished").text
    
    # check that the names are there correctly
    @b.link(:id => "_finished").click
    assert @b.url['/person']
    assert @b.text['Bath commuters’ “More Train Less Strain” campaign']
    assert @b.text['Ivybridge Rail Users’ Group']

  end

end
