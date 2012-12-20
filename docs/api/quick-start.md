---
title: API Quick Start
description: 
layout: default
---

These foo examples will show you some requests that you can make to the API and provide a quick discussion of the responses.

## Introduction to REST

The API is REST based - which means that the URL is used to specify what you are looking for, and the HTTP method is used to specify what you want to do with it.

So a `GET` of `/api/v0.1/person/1234` will get the details for the person with id `1234`, and a `POST` of data to `/api/v0.1/organisation` will create a new organisation.

## Where can I try API requests?

Every PopIt Instance has API access. It is always at `/api/...`. You can pick any instance to use to try commands on from [this list](http://popit.mysociety.org/instances) or use an instance that is fairly complete such as the [Kenyan Politicians](http://kenyan-politicians.popit.mysociety.org/) instance.

You can do `GET` requests from your browser. To view the JSON responses in your browser you may need to install the extensions suggested at the end of this article.

For other requests, such as `POST` or `PUT` you may need to use a command line tool like `curl` or write some code.

## What data is available through the API

The index page for the API is a directory of what is available:

``` javascript

// GET http://kenyan-politicians.popit.mysociety.org/api/v0.1

{
  "comment":"This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
  "meta":{
    "person_api_url":       "http://kenyan-politicians.popit.mysociety.org/api/v0.1/person",
    "organisation_api_url": "http://kenyan-politicians.popit.mysociety.org/api/v0.1/organisation",
    "position_api_url":     "http://kenyan-politicians.popit.mysociety.org/api/v0.1/position",
    "image_proxy_url":      "http://kenyan-politicians.popit.mysociety.org/image-proxy/"
  }
}
```

You could then view a list of all the people in the database:

``` javascript
// GET http://kenyan-politicians.popit.mysociety.org/api/v0.1/person

{
  "results": [
    {
      "_id": "50c0b05c6d00a0027600187c",
      "name": "Hassan Omar Hassan Sarai",
      "slug": "hassan-omar-hassan-sarai",
      "meta": {
        "api_url": "http://kenyan-politicians.popit.mysociety.org/api/v0.1/person/50c60a5f71ec32dd6e000c3d",
        "edit_url": "http://kenyan-politicians.popit.mysociety.org/person/hassan-omar-hassan-sarai"
      }
    },
    {
      "_id": "50c0b05c6d00a00276001880",
      "name": "Hellen Jepkemoi Sambili",
      "slug": "hellen-jepkemoi-sambili",
      "meta": {
        "api_url": "http://kenyan-politicians.popit.mysociety.org/api/v1/person/50c0b05c6d00a00276001880",
        "edit_url": "http://kenyan-politicians.popit.mysociety.org/person/hellen-jepkemoi-sambili"
      }
    },
    // ... more data ...
  ]
}
```

And finally view the record for an individual person in the database:

``` javascript
// GET http://kenyan-politicians.popit.mysociety.org/api/v1/person/50c0b05c6d00a0027600187c
// (note - this url may 404 if the data in this instance has been reloaded.)

{
  "result": {
    "__v": 1,
    "_id": "50c0b05c6d00a0027600187c",
    "name": "Hassan Omar Hassan Sarai",
    "slug": "hassan-omar-hassan-sarai",
    "personal_details": {
    "date_of_death": {
      "formatted": "",
      "end": null,
      "start": null
    },
    "date_of_birth": {
      "formatted": "Oct 23, 1975",
      "end": "1975-10-23T00:00:00.000Z",
      "start": "1975-10-23T00:00:00.000Z"
    }
    },
    "images": [
      {
        "url": "http://info.mzalendo.com/media_root/images/Hassan_Omar.jpg",
        "_id": "50c0b05c6d00a0027600187d",
        "created": "2012-12-06T14:49:00.635Z",
        "meta": {
          "api_url": "http://kenyan-politicians.popit.mysociety.org/api/v1/person/50c0b05c6d00a0027600187c/50c0b05c6d00a0027600187c/images/50c0b05c6d00a0027600187d",
          "image_url": "http://info.mzalendo.com/media_root/images/Hassan_Omar.jpg",
          "can_use_image_proxy": false
        }
      }
    ],
    "links": [],
    "contact_details": [],
    "other_names": [],
    "meta": {
      "edit_url": "http://kenyan-politicians.popit.mysociety.org/person/hassan-omar-hassan-sarai"
    }
  }
}
```

Note that in all the above there are `meta` blocks that provide further details such as URLs. These are not part of the actual record, but are added by the API to make working with the results easier.

## Viewing API responses in the browser.

The API returns [JSON](http://en.wikipedia.org/wiki/JSON) - a data format that is easily usable in all programming languages. It is possible to view JSON in your browser (and easily follow embedded links) if you have one of the following extensions installed:

  * [JSONView](https://chrome.google.com/webstore/detail/chklaanhfefbnpoihckbnefhakgolnmc) for Chrome
  * [JSONView](https://addons.mozilla.org/en-US/firefox/addon/jsonview/) for FireFox
  * [Not sure it can be done easily](http://stackoverflow.com/questions/2483771) for Internet Explorer :(
  * Try a search for "JSON Viewer <your browser name>" for other browsers.
