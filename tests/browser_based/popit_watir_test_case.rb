require 'test/unit'
require 'watir-webdriver'
require 'watir-webdriver/wait'
require 'uri'

class PopItWatirTestCase < Test::Unit::TestCase

  def setup

    # work out which url to use - by default use port 3000 which is what the
    # development server runs on. If the NODE_ENV is set to 'testing' use port
    # 3100. This should apply to the test suite when run from the Makefile
    # (which will also build the assets and start the testing server on that
    # port). 
    @test_port = ENV['NODE_ENV'] == 'testing' ? 3100 : 3000
    @test_hosting_url  = "http://www.127.0.0.1.xip.io:#{@test_port}/"

    # create the browser and go to the homepage
    @b = Watir::Browser.new :chrome
    @b.goto @test_hosting_url
  end

  def teardown
    @b.quit
  end

  def goto relative_url
    current_url = @b.url
    next_url = URI.join current_url, relative_url
    @b.goto next_url.to_s
  end

  def goto_dev_page
    goto '/_dev'
  end

  def goto_home_page
    goto '/'
  end

  def goto_hosting_site
    @b.goto @test_hosting_url
  end

  def goto_instance slug
    goto_hosting_site
    goto_dev_page
    form = @b.form(:name => 'add_instance_to_master')
    form.input(:name, 'instance_slug').send_keys(slug)
    form.submit
  end

  def delete_instance slug
    goto_hosting_site
    goto_dev_page
    form = @b.form(:name => 'delete_instance')
    form.input(:name, 'instance_slug').send_keys(slug)
    form.submit
    assert_equal "OK - deleted instance 'test'", @b.p(:id, 'message').text
  end

  def delete_instance_database
    goto_dev_page
    @b.button(:id, 'delete_instance_database').click    
    assert_equal "OK - database deleted", @b.p(:id, 'message').text
  end

  def load_test_fixture
    goto_dev_page
    @b.button(:id, 'load_test_fixture').click    
    assert_equal "OK - test fixture loaded", @b.p(:id, 'message').text

    # We can't always rely on the fixture to have loaded before the page comes
    # back. Check that the right data is on the person's page.
    goto '/person'
    @b.li(:text, "George W. Bush").wait_until_present

    goto_dev_page
    
  end
  
  def fetch_all_active_instance_info
    goto_dev_page
    @b.button(:id, 'fetch_all_active_instance_info').click
    assert_equal "OK - all instances synced", @b.p(:id, 'message').text
  end

  def login_to_instance
    @b.link(:text, "Sign In").click
    @b.text_field(:name, 'email').set 'owner@example.com'
    @b.text_field(:name, 'password').set 'secret'
    @b.input(:value, "Login").click
    assert_match 'Hello owner@example.com', @b.div(:id, 'signed_in').text
  end

end
