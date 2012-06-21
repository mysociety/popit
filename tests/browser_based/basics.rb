require 'popit_watir_test_case'

class Basics < PopItWatirTestCase

  def test_site_can_be_deleted_and_fixture_loaded
    goto_test_instance
    load_test_fixtures
    goto_home_page
    assert_match( /PopIt/, @b.text )
  end

end
