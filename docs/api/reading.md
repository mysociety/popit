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
// For a collection read, eg '.../person'
{
  "results": [
    // list of {} results here
  ]
}
```

``` javascript
// For a document read, eg '.../person/1234'
{
  "result": {
    // The data stored for the person
  }
}
```

The exact format of the response depends on the schema of the collection you are looking at. Please see [Schemas](../schemas) for more details.

Each response will also contain embedded `meta` blocks - please see the [Meta](../schemas/meta) notes.

## Filtering

It is possible to filter by passing parameters. For example to find all positions with the `title` "President" you would request

``` bash
curl http://instance.example.org/api/v0.1/position?title=President
```
