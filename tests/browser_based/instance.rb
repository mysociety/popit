require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InstanceBasicTests < PopItWatirTestCase

  def test_non_existent_site
    goto_instance 'test'
    goto '/'

    test_url = @b.url
    test_url['test'] = 'does-not-exist'
    @b.goto test_url

    assert_equal 'Site not found', @b.div(:id, 'content').h1.text
    assert_equal 'Site not found', @b.title
  end

  def test_existing_site
    goto_instance 'test'
    goto '/'

    assert_equal 'test', @b.title
    assert_equal 'test', @b.element(:id, 'popit_instance_name').text
  end
 
end