require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class HostingDocsTests < PopItWatirTestCase

  def test_hosting_site_docs
    goto_hosting_site

    @b.footer.link(:text => 'Documentation').click    
    assert_equal 'Overview | PopIt | mySociety', @b.title

    @b.link(:text => /^API/ ).click
    assert_equal 'API | PopIt | mySociety', @b.title

  end


end
