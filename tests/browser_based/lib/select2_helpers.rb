
module Select2Helpers

  def select2_container ( input_name )
    @b.input(:name, input_name).parent.div(:class, "select2-container").when_present
  end
  
  def select2_current_value ( input_name )
    select2_container(input_name).link(:class, 'select2-choice').span.text
  end
  
  def select2_options ( index )
    @b.li(:class => 'select2-result', :index => index ).when_present
  end
  
  def select2_highlighted_option
    # We need the sleep as it would appear that there is a certain amount of
    # flicker as the results are entered in. This lets the code wait for it to
    # pass before looking for an element which won't then get removed from the DOM.
    sleep 0.1
    @b.li(:class, "select2-highlighted").when_present
  end
  
  def select2_click_clear_icon
    @b.abbr(:class => 'select2-search-choice-close').click
  end

end
