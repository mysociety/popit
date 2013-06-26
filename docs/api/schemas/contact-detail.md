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
  "_id":   "50ca142132b4846962000008",
  "type":  "address",
  "value": "The White House, 1600 Pennsylvania Avenue NW, Washington DC, 20500"
}
```

## ID

Please ignore this field - it will [soon be removed](https://github.com/mysociety/popit/issues/232) from the API.

## Type

This is a string that describes what sort of contact detail this is. Suitable
values include "address", "email", "voice", etc.

You should make all similar contact details have the same type string. In the
admin this is encouraged by providing autocompletion that suggests types used
in existing entries.

## Value

This is a free form string. The admin UI does not currently allow line breaks.
