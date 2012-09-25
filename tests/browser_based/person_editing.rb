# encoding: UTF-8
# coding: UTF-8
# -*- coding: UTF-8 -*-

require 'lib/popit_watir_test_case'
require 'pry'
require 'net/http'
require 'uri'


class PersonEditingTests < PopItWatirTestCase

  def test_person_creation
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/person'

    def add_person_link
      @b.link(:text, '+ Add a new person')
    end

    # check that the create new person link is not shown. But that it is if the
    # user hovers over the sign in link
    assert ! add_person_link.present?
    @b.link(:text, 'Sign In').hover

    assert add_person_link.present?

    # login and check link is visible
    login_as_instance_owner
    goto '/person'
    assert @b.link(:text, '+ Add a new person').present?

    # click on the create new person link and check that the form has popped up    
    assert ! @b.form(:name, 'create-new-person').present?
    add_person_link.click
    @b.form(:name, 'create-new-person').wait_until_present

    # try to enter an empty name
    @b.input(:value, "Create new person").click
    assert_equal 'Required', @b.div(:class, 'bbf-help').text
    
    # enter a proper name, get sent to person page
    @b.text_field(:name, 'name').set "Joe Bloggs"
    assert_equal "joe-bloggs", @b.text_field(:name, 'slug').value

    @b.input(:value, "Create new person").click
    @b.wait_until { @b.title != 'People' }
    assert_equal "Joe Bloggs", @b.title
    assert_match /\/joe-bloggs$/, @b.url
    
    # check that this person is in the list of people too
    @b.back
    @b.refresh
    @b.li(:text, "Joe Bloggs").link.click
    assert_equal "Joe Bloggs", @b.title    
    
    # enter person check for no suggestions
    @b.back
    @b.refresh
    add_person_link.click
    @b.text_field(:name, 'name').set "I'm a unique name"
    assert_equal 'No matches', @b.ul(:class, 'suggestions').li.text

    # enter dup name and check for suggestions
    @b.refresh
    add_person_link.click
    @b.text_field(:name, 'name').set "George"
    @b.wait_until { @b.ul(:class, 'suggestions').present? && @b.ul(:class, 'suggestions').li.text['George Bush'] }
    
    # click on a suggestion, check get existing person
    @b.ul(:class, 'suggestions').li.link.click
    assert_match /\/george-bush$/, @b.url
    
    # enter dup, create anyway, check for new person
    @b.back
    add_person_link.click
    @b.text_field(:name, 'name').set "George Bush"
    @b.input(:value, "Create new person").click
    @b.wait_until { @b.title != 'People' }
    assert_match /\/george-bush-1$/, @b.url
    
    # enter name that can't be slugged
    @b.back
    add_person_link.click
    @b.text_field(:name, 'name').set "网页"
    assert_equal "", @b.text_field(:name, 'slug').value
    @b.input(:value, "Create new person").click
    assert_equal 'Required', @b.div(:class =>'bbf-help', :index => 1 ).text
    @b.text_field(:name, 'slug').set 'chinese-name'
    @b.input(:value, "Create new person").click
    @b.wait_until { @b.title != 'People' }
    assert_equal "网页", @b.title
    assert_match /\/chinese-name$/, @b.url
    
  end


  def test_person_deleting
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/'
    login_as_instance_owner    

    # goto bush and check he is there
    goto '/person/george-bush'    
    assert_equal @b.title, 'George Bush'

    # click on delete link, wait for form
    @b.link(:text, '- delete this person').click
    @b.wait_until { @b.form(:name, 'remove-person').present? }

    assert @b.input(:value, "Really delete 'George Bush'?").present?
    @b.input(:value, "Really delete 'George Bush'?").click
    
    @b.wait_until { @b.title == 'People' }
    assert_equal @b.element(:id, "flash-info").li.text, "Entry 'George Bush' deleted."

    goto '/person/george-bush'    
    assert_equal @b.title, 'Page not found'

  end

  def test_person_editing
    goto_instance 'test'
    delete_instance_database
    load_test_fixture
    goto '/person/george-bush'    

    # check that without being logged in clicking on the summary has no effect
    assert ! @b.textarea(:name => 'value').present?
    @b.element(:css => '[data-api-name=summary]').click
    assert ! @b.textarea(:name => 'value').present?
    
    # login and try again
    login_as_instance_owner
    goto '/person/george-bush'    
    assert ! @b.textarea(:name => 'value').present?
    @b.element(:css => '[data-api-name=summary]').click
    assert @b.textarea(:name => 'value').present?

    # check that the text is as expected
    original = '41th President of the United States'
    assert_equal original, @b.textarea(:name => 'value').value
    
    # press escape key to cancel edit
    @b.send_keys 'This is some new text'
    @b.send_keys :escape
    assert ! @b.textarea(:name => 'value').present?
    assert_equal original, @b.element(:css => '[data-api-name=summary]').text

    # Edit the text to something new, tab return to submit
    new_text = 'This is some new text'
    @b.element(:css => '[data-api-name=summary]').click
    @b.textarea(:name => 'value').set new_text
    @b.send_keys :tab
    @b.send_keys :return
    assert ! @b.textarea(:name => 'value').present?
    assert_equal new_text, @b.element(:css => '[data-api-name=summary]').text

    # reload the page, check that the new text ist still there
    wait_for_ajax_requests_to_end
    @b.refresh
    assert_equal new_text, @b.element(:css => '[data-api-name=summary]').text

    # grab the name for checking later
    original_name = @b.h1(:class => 'current-person').text
    changed_name  = 'Changed Name'

    # check that the name can be edited too and that escape cancels
    assert ! @b.h1(:class => 'current-person').input.present?
    @b.h1(:class => 'current-person').click
    assert @b.h1(:class => 'current-person').input.present?
    @b.h1(:class => 'current-person').text_field.set changed_name
    @b.send_keys :escape
    assert ! @b.h1(:class => 'current-person').input.present?    
    assert_equal original_name, @b.h1(:class => 'current-person').text

    # check that for non-textarea bluring cancels
    assert ! @b.h1(:class => 'current-person').input.present?
    @b.h1(:class => 'current-person').click
    assert @b.h1(:class => 'current-person').input.present?
    @b.h1(:class => 'current-person').text_field.set changed_name
    @b.div(:id => 'content').click
    sleep 2 # there is a delay in the js
    assert ! @b.h1(:class => 'current-person').input.present?    
    assert_equal original_name, @b.h1(:class => 'current-person').text

    # check that edits are saved
    assert ! @b.h1(:class => 'current-person').input.present?
    @b.h1(:class => 'current-person').click
    assert @b.h1(:class => 'current-person').input.present?
    @b.h1(:class => 'current-person').text_field.set changed_name
    @b.send_keys :return
    assert ! @b.h1(:class => 'current-person').input.present?    
    assert_equal changed_name, @b.h1(:class => 'current-person').text
    wait_for_ajax_requests_to_end
    @b.refresh
    assert_equal changed_name, @b.h1(:class => 'current-person').text
    
    # check that the name can be edited via the link
    assert ! @b.h1(:class => 'current-person').input.present?
    @b.link(:text => "^ edit this person's name").click
    assert @b.h1(:class => 'current-person').input.present?
    @b.send_keys :escape
    assert ! @b.h1(:class => 'current-person').input.present?    

  end

end
