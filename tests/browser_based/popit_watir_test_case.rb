require 'test/unit'
require 'watir-webdriver'

class InstanceWatirTestCase < Test::Unit::TestCase

  def setup

    # work out which url to use - by default use port 3000 which is what the
    # development server runs on. If the NODE_ENV is set to 'testing' use port
    # 3100. This should apply to the test suite when run from the Makefile
    # (which will also build the assets and start the testing server on that
    # port). 
    @test_port         = ENV['NODE_ENV'] == 'testing' ? 3100 : 3000
    @test_instance_url = "http://test.127-0-0-1.org.uk:#{@test_port}/"
    @test_hosting_url  = "http://www.127-0-0-1.org.uk:#{@test_port}/"

    # create the browser and go to the homepage
    @b = Watir::Browser.new :chrome
    @b.goto @test_instance_url

  end

  def teardown
    @b.quit
  end

end
