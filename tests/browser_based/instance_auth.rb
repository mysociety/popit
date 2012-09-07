require 'popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class InstanceAuthTests < PopItWatirTestCase

  def test_logging_in_and_out
    delete_instance 'test'
    goto_instance 'test'
    load_test_fixture

    # goto homepage
    goto '/'
    assert_equal 'test', @b.title

    # try signing in with no credentials
    @b.link(:text, "Sign In").click
    @b.input(:value, "Login").click
    assert_equal 'Missing login', @b.li(:class => 'error').text

    # missing password
    @b.text_field(:name, 'email').set "foo"
    @b.input(:value, "Login").click
    assert_equal 'Missing password', @b.li(:class => 'error').text

    # bad password
    @b.text_field(:name, 'password').set "bad"
    @b.input(:value, "Login").click
    assert_equal 'credentials wrong', @b.li(:class => 'error').text

    # missing email
    @b.text_field(:name, 'email').clear
    @b.text_field(:name, 'password').set "bad"
    @b.input(:value, "Login").click
    assert_equal 'Missing login', @b.li(:class => 'error').text

    # correct login details
    @b.text_field(:name, 'email').set 'owner@example.com'
    @b.text_field(:name, 'password').set 'secret'
    @b.input(:value, "Login").click
    assert_match 'Signed in as owner@example.com', @b.li(:id, 'signed_in').text

    # correct login details (check spaces are stripped)
    @b.link(:text, 'Sign Out').click
    @b.link(:text, "Sign In").click
    @b.text_field(:name, 'email').set '  owner@example.com  '
    @b.text_field(:name, 'password').set 'secret'
    @b.input(:value, "Login").click
    assert_match 'Signed in as owner@example.com', @b.li(:id, 'signed_in').text

    # check that the flash message is shown
    assert_equal @b.div(:id, 'flash-info').li.text, "You are now logged in."
    @b.div(:id, 'flash-info').link(:class, 'close').click    
    @b.wait_until { ! @b.div(:id, 'flash-info').present? }
    @b.refresh
    assert ! @b.div(:id, 'flash-info').present?

    # check that we can log out too
    @b.link(:text, 'Sign Out').click
    assert_equal 'already have an account? Sign In', @b.li(:id, 'sign_in').text

    # check that trying to go to a page that requires auth leads to you being
    # redirected back to that page after logging in
    goto '/about/edit' # need to be an owner to edit this
    @b.text_field(:name, 'email').set 'owner@example.com'
    @b.text_field(:name, 'password').set 'secret'
    @b.input(:value, "Login").click
    assert_match 'Signed in as owner@example.com', @b.li(:id, 'signed_in').text
    assert_match /\/about\/edit$/, @b.url

    # check that we redirect back to the page you clicked login on too
    @b.link(:text, 'Sign Out').click
    goto '/person/george-bush'
    @b.link(:text, "Sign In").click
    @b.text_field(:name, 'email').set 'owner@example.com'
    @b.text_field(:name, 'password').set 'secret'
    @b.input(:value, "Login").click
    assert_match 'Signed in as owner@example.com', @b.li(:id, 'signed_in').text
    assert_match /\/person\/george-bush$/, @b.url
    

  end

end