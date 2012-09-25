require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InstanceBasicTests < PopItWatirTestCase

  def test_non_existent_site
    goto_instance 'foobar'
    goto '/'

    foobar_url = @b.url
    foobar_url['foobar'] = 'does-not-exist'
    @b.goto foobar_url

    assert_equal 'Site not found', @b.div(:id, 'content').h1.text
    assert_equal 'Site not found', @b.title
  end

  def test_existing_site
    goto_instance 'foobar'
    goto '/'

    assert_equal 'foobar', @b.title
    assert_equal 'foobar', @b.element(:id, 'popit_instance_name').text
  end
 
end