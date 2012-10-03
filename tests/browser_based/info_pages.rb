require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InfoPageTests < PopItWatirTestCase

  def info_page_tests

    # bad page should 404
    goto '/info/does_not_exist'
    assert_equal 'Page not found', @b.title

    # good page should display
    goto '/info/privacy'
    assert_equal 'Privacy', @b.title
  end

  def test_info_pages_hosting_site
    goto_hosting_site
    info_page_tests
  end

  def test_info_pages_instance_site
    goto_instance 'test'
    info_page_tests
  end

end