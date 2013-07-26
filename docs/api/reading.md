---
title: Reading from the API
description: 
layout: default
---

Every PopIt instance has an API that makes almost all the data stored in it accessible programatically.

This allows the data to be used by other websites, mobile phone apps and more.

No authentication is required for read access.

## GET response structure

All `GET` requests are returned `JSON` responses. These will have the form:

``` javascript
// For a collection read, eg '.../persons'
{
  "result": [
    // list of {} results here
  ]
}
```

``` javascript
// For a document read, eg '.../persons/1234'
{
  "result": {
    // The data stored for the person
  }
}
```

The exact format of the response depends on the schema of the collection you
are looking at. Please see [Schemas](../schemas) for more details.
