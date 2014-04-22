require 'test/unit'
require 'watir-webdriver'
require 'watir-webdriver/wait'
require 'uri'

class PopItWatirTestCase < Test::Unit::TestCase

  def setup

    # work out which url to use - by default use port 3000 which is what the
    # development server runs on. If the NODE_ENV is set to 'testing' use port
    # 3100. This should apply to the test suite when run from the Makefile
    # (which will also build the assets and start the testing server on that
    # port). 
    @test_port = ENV['NODE_ENV'] == 'testing' ? 3100 : 3000
    @test_hosting_url  = ENV['WATIR_HOSTING_URL'] || "http://www.127.0.0.1.xip.io:#{@test_port}/"

    # Never use cached elements - needed to avoid occasional
    # "Selenium::WebDriver::Error::StaleElementReferenceError: Element is no longer attached to the DOM"
    # failures
    Watir::always_locate = true

    # create the browser and go to the homepage
    @b = Watir::Browser.new ENV['WATIR_BROWSER'] || :chrome
    
    # add checker that will wait for admin app to run if needed - this is mostly
    # for tests that run against remote servers where activating the javascript
    # might take a while.
    @b.add_checker(
      Proc.new do
        if @b.li(:id => 'signed_in').present?
          @b.wait_until { @b.element(:id => 'instance-app-activated').present? }
        end
      end
    )
        
    
    @b.goto @test_hosting_url
  end

  def teardown
    @b.quit
  end

  def goto relative_url
    current_url = @b.url
    next_url = URI.join current_url, relative_url
    @b.goto next_url.to_s
  end

  def goto_dev_page
    goto '/_dev'
  end

  def goto_home_page
    goto '/'
  end

  def goto_hosting_site
    @b.goto @test_hosting_url
  end

  def goto_instance slug
    goto_hosting_site
    goto_dev_page
    form = @b.form(:name => 'add_instance_to_master')
    form.input(:name, 'instance_slug').send_keys(slug)
    form.submit
  end

  def delete_instance slug
    goto_hosting_site
    goto_dev_page
    form = @b.form(:name => 'delete_instance')
    form.input(:name, 'instance_slug').send_keys(slug)
    form.submit
    assert_equal "OK - deleted instance 'test'", @b.p(:id, 'message').text
  end

  def delete_instance_database
    goto_dev_page
    @b.button(:id, 'delete_instance_database').click    
    assert_equal "OK - database deleted", @b.p(:id, 'message').text
  end

  def load_test_fixture
    goto_dev_page
    @b.button(:id, 'load_test_fixture').click    
    assert_equal "OK - test fixture loaded", @b.p(:id, 'message').text

    # We can't always rely on the fixture to have loaded before the page comes
    # back. Check that the right data is on the person's page.
    goto '/persons'
    @b.li(:text, "George W. Bush").wait_until_present

    goto_dev_page
    
  end
  
  def fetch_all_active_instance_info
    goto_dev_page
    @b.button(:id, 'fetch_all_active_instance_info').click
    assert_equal "OK - all instances synced", @b.p(:id, 'message').text
  end

  def run_as_all_user_types
    # Just test owner type for now
    # yield :guest
    yield :owner
  end

  def login_as type
    case type
    when :guest
      login_as_instance_guest
    when :owner
      login_as_instance_owner
    else 
      raise "Can't login as #{type}"
    end
  end

  def login_as_instance_owner
    goto_dev_page
    @b.button(:id, 'login_as_instance_owner').click
    assert_match 'Signed in as owner@example.com', @b.li(:id, 'signed_in').text
  end
  
  def login_as_instance_guest
    enable_guest_access
    @b.button(:id, 'login_as_instance_guest').click
    assert_match 'Signed in as a Guest', @b.li(:id, 'signed_in').text
  end

  def enable_guest_access
    goto_dev_page
    @b.button(:id, 'enable_guest_access').click
  end

  def disable_guest_access
    goto_dev_page
    @b.button(:id, 'disable_guest_access').click
  end

  def wait_for_ajax_requests_to_end
    @b.wait_until { ! @b.element(:id, 'ajax-loader').present? }
  end

  def assert_path(expected)
    assert_equal expected, URI.parse(@b.url).path
  end
  
end
