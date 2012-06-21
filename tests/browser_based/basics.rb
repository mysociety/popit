require 'popit_watir_test_case'

class Basics < PopItWatirTestCase

  def test_exit_code_correctly_produced
    b = @b
    b.goto '/'
    assert_match( /PopIt/, b.text )
  end

end
