---
title: Position Schema
description: 
layout: default
---

Positions join people to organisations.

## Schema

``` javascript
{
  "_id":          "4f9ea1326e8770d854c45a23",
  "title":        "President",
  "person":       "4f9ea1316e8770d854c45a1e",
  "organisation": "4f9ea1326e8770d854c45a21",
  "meta": {
    "api_url":  "http://instance.example.org:3000/api/v1/position/4f9ea1326e8770d854c45a23",
    "edit_url": "http://instance.example.org:3000/position/4f9ea1326e8770d854c45a23"
  }
}
```

## Title

Required. Free form string. In the PopIt admin this is auto-completed to an existing entry to help with preventing duplicates.

## Person and organisation

The id of the person and organisation that this position is linked to.

## To be added

Start and end dates - which will be [partial dates](partial-date).
