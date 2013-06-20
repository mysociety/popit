---
title: Person and Organisation schemas
description: 
layout: default
---

People and organisations have very similar schemas and so are both covered by this description.

## Schema

``` javascript
{
  "id":     "4f9ea1316e8770d854c45a1e",
  "slug":    "bill-clinton",
  "summary": "42nd President of the United States",

  "name":        "Bill Clinton",
  "other_names": [ ... array of other names ... ],

  "birth_date": { ... partial date ... },
  "death_date": { ... partial date ... },

  "contact_details": [ ... array of contact details ... ],
  "images":          [ ... array of images ... ],
  "links":           [ ... array of links ... ],

  "meta": {
    "edit_url": "http://instance.example.org/person/bill-clinton",
    "positions_api_url": "http://instance.example.org/api/v0.1/position?person=4f9ea1316e8770d854c45a1e"
  }

}
```

Please see the other pages for details about the [partial dates](../partial-date), the [contact details](../contact-detail), the [images](../image) and the [links](../link). For `other_names` see below.

## ID

This is assigned by the database. It cannot be changed and will never change.

## Slug

The slug is a unique key that can be used to identify the person or organisation. It is intended to be used in urls and so is made up of url safe characters.

**NOTE**: This might well change when/if [issue #175](https://github.com/mysociety/popit/issues/175) is tackled.

## Summary

This is a brief bit of text that provides details about the person or organisation. The exact content will depend on the purpose of the instance. 

## Names

### Name

The primary `name` field holds the name that is primarily used for identifying this person or organisation. This will depend on the purpose of the instance and the primary language of the instance. For example both "[Dwayne Johnson](http://en.wikipedia.org/wiki/Dwayne_Johnson)" and "The Rock" would be valid names, but the purpose of the PopIt instance would decide which was more suitable.

### Other names

This is an array of other names that the person/organisation might have. They could be pre-marital names, or aliases, or even latinisations. For example "[Hillary Clinton](http://en.wikipedia.org/wiki/Hillary_Rodham_Clinton)" would have as other names her full legal name "Hillary Diane Rodham Clinton", her maiden name "Hillary Diane Rodham" and her secret service codename "Evergreen".

``` javascript
{
  name:    "Evergreen",
  comment: "Secret service code name",
  // start date - to be added
  // end date   - to be added
}
```

### Personal Details (person only)

This is a block that can contain things like dates of birth and death. It also server as as useful place to put other information that might be relevant to your instance, such as gender etc.
