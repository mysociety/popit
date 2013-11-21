require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class HostingTests < PopItWatirTestCase

  def test_hosting_site_homepage
    goto_hosting_site
    assert_match( /Welcome to PopIt/, @b.text )
  end

  def test_404_page
    goto_hosting_site
    goto '/instances/not_found'
    assert_equal 'Page not found', @b.title
    
    # Watir won't let us check that we got a 404 code
    u = URI.parse @b.url
    status_code = Net::HTTP.start(u.host,u.port){|http| http.head(u.request_uri).code }
    assert_equal '404', status_code
  end

  def test_create_instance
    goto_hosting_site
    delete_instance 'test'

    # check that the instance does not exist - use testing=1 so that the proper
    # url is not cached by varnish as a 404. This allows these tests to be run
    # against the development machine.
    goto "/instances/test?testing=1"
    assert_equal "Page not found", @b.title    

    # check that the create new site page is not shown
    goto_home_page
    assert_equal @b.links(:href, /\/instances\/new$/).size, 0

    # Check that the new instance page 404s
    goto "/instances/new"
    assert_match "Create your PopIt site", @b.title

    # go to the create new site page (not linked to from homepage)
    # goto_home_page
    # @b.link(:text, 'Create your PopIt site').click
    goto "/instances/new"
    
    # submit the form with no values, check for error
    @b.input(:value, 'Create your own PopIt').click
    assert_match "Invitation code not correct - please contact us to get one", @b.text
    
    # submit the form with no values, check for error
    @b.text_field(:name, 'invite').set("Bad Value")
    @b.input(:value, 'Create your own PopIt').click
    assert_match "Invitation code not correct - please contact us to get one", @b.text
    
    # submit the form with no values, check for error
    @b.text_field(:name, 'invite').set("Open Sesame")
    @b.input(:value, 'Create your own PopIt').click
    assert_match "Error is 'required'", @b.text
    assert_match "Error is 'required'", @b.text    
    
    # check a slug that is too short
    @b.text_field(:name, 'slug').set("foo")
    @b.input(:value, 'Create your own PopIt').click
    assert_match "Error is 'regexp'", @b.text
    assert_match "Error is 'required'", @b.text    
    
    # check that the cursor keys work in the slug field
    @b.text_field(:name, 'slug').set("test")
    assert_equal 'test', @b.text_field(:name, 'slug').value
    @b.text_field(:name, 'slug').send_keys [:arrow_left, :arrow_left, 'xx']  
    assert_equal 'texxst', @b.text_field(:name, 'slug').value
    
    # check that a good slug does not error
    @b.text_field(:name, 'slug').set("test")
    @b.input(:value, 'Create your own PopIt').click
    assert_not_match Regexp.new("Error is 'regexp'"), @b.text
    assert_match Regexp.new("Error is 'required'"), @b.text
    
    # check that a bad email is rejected
    #   NOTE - these tests are commented out as recent browsers catch the bad
    #   email address and show their own little warning. I can't seem to see how
    #   to test for that warning - it does not appear in the DOM.
    # @b.text_field(:name, 'email').set("bob")
    # @b.input(:value, 'Create your own PopIt').click
    # assert_match "Error is 'not_an_email'", @b.text    
    
    # submit good details
    @b.text_field(:name, 'email').set("bob@example.com")
    @b.input(:value, 'Create your own PopIt').click
    assert_match "Nearly Done! Now check your email...", @b.text    
    
    # check that the site is now reserved
    goto '/'
    # @b.link(:text, "Create your PopIt site").click
    goto "/instances/new"
    @b.text_field(:name, 'invite').set("Open Sesame")
    @b.text_field(:id, 'slug').set("test")
    @b.input(:value, 'Create your own PopIt').click
    assert_match "Error is 'slug_not_unique'", @b.text    
    
    # check that the instance page works
    goto "/instances/test"
    assert_equal "Pending: test", @b.title
            
    # go to the last email page
    goto "/_dev/last_email"
    
    # capture the urls
    correct_confirmation_url = @b.link.href
    wrong_confirmation_url   = correct_confirmation_url + 'WRONG'
    
    # try using an incorrect confirmation token
    @b.goto wrong_confirmation_url
    assert @b.div(:id => 'content').text['Wrong confirmation token']
    
    # on the confirm app page
    @b.goto correct_confirmation_url
    assert_match 'Fantastic!', @b.div(:id, 'content').h1.text
    @b.form.submit
    
    # check that we are on the instance url now
    assert_match /^http:\/\/test\./, @b.url
    assert_match 'test', @b.span(:id, 'popit_instance_name').text
    assert_equal 'Welcome to your new site!', @b.div(:id, 'content').h1.text
    
    # check that we are logged in
    assert_match 'Signed in as bob@example.com', @b.li(:id, 'signed_in').text
            
  end

end
