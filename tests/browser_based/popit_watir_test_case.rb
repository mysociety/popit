require 'test/unit'
require 'watir-webdriver'

class PopItWatirTestCase < Test::Unit::TestCase

  def setup
    @b = Watir::Browser.new :chrome
    @b.goto 'http://test.127-0-0-1.org.uk:3000/'
  end

  def teardown
    @b.quit
  end

end
