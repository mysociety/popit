require 'test/unit'
require 'watir-webdriver'
require 'uri'

class PopItWatirTestCase < Test::Unit::TestCase

  def setup

    # work out which url to use - by default use port 3000 which is what the
    # development server runs on. If the NODE_ENV is set to 'testing' use port
    # 3100. This should apply to the test suite when run from the Makefile
    # (which will also build the assets and start the testing server on that
    # port). 
    @test_port = ENV['NODE_ENV'] == 'testing' ? 3100 : 3000
    @test_hosting_url  = "http://www.127-0-0-1.org.uk:#{@test_port}/"

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

  def goto_test_instance
    @b.goto @test_hosting_url
    goto_dev_page
    @b.input(:name, 'instance_slug').send_keys('test')
    @b.button(:id, 'add_instance_to_master').click
  end

  def load_test_fixtures
    goto_dev_page
    @b.button(:id, 'delete_this_instance_database').click    
    @b.button(:id, 'load_testing_fixture').click    
  end

end
