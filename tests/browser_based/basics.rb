require 'test/unit'
require 'watir-webdriver'

# FIXME: questions for Louise:
#
# * resolve exit status oddness if assert fails before browser is quit (something to do with subprocesses perhaps?)
# * correct way to list rail dependencies for makefile
# * how to specify the url to connect to - ENV perhaps?
# * achieve more DRY
# * what noob errors have I made :) ?


class PopItWatirTestCase < Test::Unit::TestCase

  def setup
    @b = Watir::Browser.new :chrome
    @b.goto 'http://test.127-0-0-1.org.uk:3000/'
  end

  def teardown
    @b.quit
  end

end


class Basics < PopItWatirTestCase

  def test_exit_code_correctly_produced
    b = @b
    b.goto '/'
    assert_match( /PopIt/, b.text )
  end

end
