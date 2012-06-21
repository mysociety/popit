require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class HostingTests < PopItWatirTestCase

  def test_site_can_be_deleted_and_fixture_loaded
    goto_hosting_site
    assert_match( /Welcome to PopIt/, @b.text )
  end

  def test_404_page
    goto_hosting_site
    goto '/instance/not_found'
    assert_equal 'Page not found', @b.title
    
    # Watir won't let us check that we got a 404 code
    u = URI.parse @b.url
    status_code = Net::HTTP.start(u.host,u.port){|http| http.head(u.request_uri).code }
    assert_equal '404', status_code
  end

end
