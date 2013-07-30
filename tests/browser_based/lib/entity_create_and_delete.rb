
module EntityCreateAndDelete

  def check_delete_entity(opts={})

    page_title = @b.title
    page_url   = @b.url

    # click on delete link, wait for form
    @b.link(:text, opts[:delete_link_text]).click
    @b.wait_until { @b.form(:name, opts[:form_name]).present? }

    assert @b.input(:value, "Really delete '#{page_title}'?").present?
    @b.input(:value, "Really delete '#{page_title}'?").click
    
    @b.wait_until { @b.title != page_title }
    goto page_url    
    assert_equal @b.title, 'Page not found'
    
  end

end
