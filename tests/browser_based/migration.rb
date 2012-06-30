# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

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

    login_to_instance
    assert_equal 'Migration Tool', @b.title
  end

 def test_migration
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/migration/'

    # try to open migration tool, get sent to login page
    assert_match /\login$/, @b.url 

    login_to_instance
    assert_equal 'Migration Tool', @b.title

    # @browser.file_field(:name, "fileUploadFieldName").set File.dirname(__FILE__)+"generated.csv"

  end

end
