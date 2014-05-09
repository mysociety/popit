require 'lib/popit_watir_test_case'
require 'pry'

class Basics < PopItWatirTestCase

  def test_site_can_be_deleted_and_fixture_loaded
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto_home_page
    assert_match( /PopIt/, @b.text )

    @b.link(:text, 'People').click
    assert_equal( "BO\nBarack Obama", @b.div(:id, 'content').ul.li.text );
  end

end
