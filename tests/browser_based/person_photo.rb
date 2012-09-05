# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class PersonPhotoTests < PopItWatirTestCase

  def test_person_upload_photo_file
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/'
    login_as_instance_owner

    # check that there is no photo to start with
    goto '/person/barack-obama'    
    assert ! @b.ul(:class => 'photos').li.img.present?    

    # upload a file
    @b.link(:text => '+ add a photograph').click
    @b.file_field(:name => 'image').set( File.join( File.dirname(__FILE__), 'barack_obama.jpg') )
    @b.input(:type => 'submit').click

    # check that the file is now shown on the page
    assert_match /\/person\/barack-obama$/, @b.url
    assert @b.ul(:class => 'photos').li.img.present?

    # delete the photo
    @b.ul(:class => 'photos').input(:value => 'delete').click

    # check that the photo is now gone
    assert_match /\/person\/barack-obama$/, @b.url
    assert ! @b.ul(:class => 'photos').li.img.present?

  end 

end
