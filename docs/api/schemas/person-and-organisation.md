---
title: Person and Organisation schemas
description: 
layout: default
---

People and organisations have very similar schemas and so are both covered by this description.

Typical Schema

``` javascript
{
  "_id":     "4f9ea1316e8770d854c45a1e",
  "slug":    "bill-clinton",
  "summary": "42nd President of the United States",

  "name":        "Bill Clinton",
  "other_names": [ ... array of other names ... ],

  "personal_details": {
    "date_of_birth": ... a partial date ...,
    "date_of_death": ... a partial date ...
  },

  "contact_details": [ ... array of contact details ... ],
  "images":          [ ... array of images ... ],
  "links":           [ ... array of links ... ],

  "meta": {
    "edit_url": "http://instance.example.org/person/bill-clinton",
    "positions_api_url": "http://instance.example.org/api/v1/position?person=4f9ea1316e8770d854c45a1e"
  }

}
```

Please see the other pages for details about the [partial dates](../partial-date), the [contact details](../contact-detail), the [images](../image) and the [links](../link).

## Names

The primary `name` field holds the name that is primarily used for identifying this person or organisation. This will depend on the purpose of the instance and the primary language of the instance. For example both "[Dwayne Johnson](http://en.wikipedia.org/wiki/Dwayne_Johnson)" and "The Rock" would be valid names, but the purpose of the PopIt instance would decide which was more suitable.

### Other names

This is an array of other names that the person/organisation might have. They could be pre-marital names, or aliases, or even latinisations. For example "[Hillary Clinton](http://en.wikipedia.org/wiki/Hillary_Rodham_Clinton)" would have as other names her full legal name "Hillary Diane Rodham Clinton", her maiden name "Hillary Diane Rodham" and her secret service codename "Evergreen".
