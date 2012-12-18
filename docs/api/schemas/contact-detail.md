---
title: Contact Detail Schema
description: 
layout: default
---

Contact details are things that help you contact the person or organisation that they belong to.

## Schema

An example entry for the person "Barack Obama":

``` javascript
{
  "id":   "50ca142132b4846962000008",
  "kind":  "Address",
  "value": "The White House, 1600 Pennsylvania Avenue NW, Washington DC, 20500",
  "meta": {
    "api_url": "http://instance.example.org/api/v1/person/4f9ea1326e8770d854c45a20/4f9ea1326e8770d854c45a20/contact_details/50ca142132b4846962000008"
  }
}
```

## Kind

This is a free form string that describes what sort of contact detail this is. Suitable values include "Address", "Email", "Mobile", etc.

You should make all similar contact details have the same kind string. In the admin this is encouraged by providing autocompletion that suggests kinds used in  existing entries.

## Value

This is a free form string. The admin UI does not currently allow line breaks.
