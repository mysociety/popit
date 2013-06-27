# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class PhotoTests < PopItWatirTestCase

  def test_person_upload_photo_file
    check_upload_photo(
      :url                        => '/persons/barack-obama',
      :placeholder_filename_regex => /person_placeholder\.svg/,
      :test_image                 => 'static/barack_obama.jpg',
    )
  end 

  def test_organization_upload_photo_file
    check_upload_photo(
      :url                        => '/organizations/united-states-government',
      :placeholder_filename_regex => /organization_placeholder\.svg/,
      :test_image                 => 'static/barack_obama.jpg',
    )
  end 

  #################

  def check_upload_photo(opts)
    run_as_all_user_types {
      |user_type|

      goto_instance 'test'
      delete_instance_database
      load_test_fixture
      goto '/'
      login_as user_type
      
      goto opts[:url]
      
      # check that only the placeholder photo is shown to start with
      assert @b.ul(:class => 'photos').li.img.present?
      assert_match @b.ul(:class => 'photos').li.img.attribute_value('src'), opts[:placeholder_filename_regex]
      
      # upload a file
      @b.link(:text => '+ add a photograph').click
      @b.file_field(:name => 'image').set( File.join( File.dirname(__FILE__), opts[:test_image]) )
      @b.input(:type => 'submit').click
      
      # check that the file is now shown on the page
      assert_path opts[:url]
      assert @b.ul(:class => 'photos').li.img.present?
      
      # delete the photo
      @b.ul(:class => 'photos').input(:value => 'delete').click
      
      # check that the photo is now gone
      assert_path opts[:url]
      assert @b.ul(:class => 'photos').li.img.present?
      assert_match @b.ul(:class => 'photos').li.img.attribute_value('src'), opts[:placeholder_filename_regex]
    }
  end 

end
