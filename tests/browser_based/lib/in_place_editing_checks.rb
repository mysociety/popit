
module InPlaceEditingChecks

  def check_editing_name
        
    # grab the name for checking later
    original_name = @b.h1(:class => 'current-entity').text
    changed_name  = 'Changed Name'

    # check that the name can be edited too and that escape cancels
    assert ! @b.h1(:class => 'current-entity').input.present?
    @b.h1(:class => 'current-entity').click
    assert @b.h1(:class => 'current-entity').input.present?
    @b.h1(:class => 'current-entity').text_field.set changed_name
    @b.send_keys :escape
    assert ! @b.h1(:class => 'current-entity').input.present?    
    assert_equal original_name, @b.h1(:class => 'current-entity').text

    # check that for non-textarea bluring cancels
    assert ! @b.h1(:class => 'current-entity').input.present?
    @b.h1(:class => 'current-entity').click
    assert @b.h1(:class => 'current-entity').input.present?
    @b.h1(:class => 'current-entity').text_field.set changed_name
    @b.div(:id => 'content').click
    sleep 2 # there is a delay in the js
    assert ! @b.h1(:class => 'current-entity').input.present?    
    assert_equal original_name, @b.h1(:class => 'current-entity').text

    # check that edits are saved
    assert ! @b.h1(:class => 'current-entity').input.present?
    @b.h1(:class => 'current-entity').click
    assert @b.h1(:class => 'current-entity').input.present?
    @b.h1(:class => 'current-entity').text_field.set changed_name
    @b.send_keys :return
    assert ! @b.h1(:class => 'current-entity').input.present?    
    assert_equal changed_name, @b.h1(:class => 'current-entity').text
    wait_for_ajax_requests_to_end
    @b.refresh
    assert_equal changed_name, @b.h1(:class => 'current-entity').text
    
    # check that the name can be edited via the link
    assert ! @b.h1(:class => 'current-entity').input.present?
    @b.link(:text => /\^ edit this \w+'s name/).click
    assert @b.h1(:class => 'current-entity').input.present?
    @b.send_keys :escape
    assert ! @b.h1(:class => 'current-entity').input.present?        
  end

  def check_editing_summary user_type
    test_page_url = @b.url

    # check that without being logged in clicking on the summary has no effect
    assert ! @b.textarea(:name => 'value').present?
    @b.element(:css => '[data-api-name=summary]').click
    assert ! @b.textarea(:name => 'value').present?
    
    # login and try again
    login_as user_type
    goto test_page_url    
    assert ! @b.textarea(:name => 'value').present?
    @b.element(:css => '[data-api-name=summary]').click
    assert @b.textarea(:name => 'value').present?

    # check that the text is as expected
    original = @b.textarea(:name => 'value').value
    
    # press escape key to cancel edit
    @b.send_keys 'This is some new text'
    @b.send_keys :escape
    assert ! @b.textarea(:name => 'value').present?
    assert_equal @b.element(:css => '[data-api-name=summary]').text, original

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
  end

end
