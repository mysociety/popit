---
title: API Quick Start
description: 
layout: default
---

These examples will show you some requests that you can make to the API and provide a quick discussion of the responses.

## Introduction to REST

The API is REST based - which means that the URL is used to specify what you are looking for, and the HTTP method is used to specify what you want to do with it.

So a `GET` of `/api/v0.1/persons/1234` will get the details for the person with id `1234`, and a `POST` of data to `/api/v0.1/organizations` will create a new organization.

## Where can I try API requests?

Every PopIt Instance has API access. It is always at `/api/...`. You can pick any instance to use to try commands on from [this list](http://popit.mysociety.org/instances) or use an instance that is fairly complete such as the [South African People's Assembly](http://za-peoples-assembly.popit.mysociety.org/) instance.

You can do `GET` requests from your browser. To view the JSON responses in your browser you may need to install the extensions suggested at the end of this article.

For other requests, such as `POST` or `PUT` you may need to use a command line tool like `curl` or write some code.

## What data is available through the API

The index page for the API is a directory of what is available:

``` javascript

// GET http://za-peoples-assembly.popit.mysociety.org/api/v0.1

{
  "note": "This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
  "meta": {
    "person_api_url": "http:\/\/za-peoples-assembly.popit.mysociety.org\/api\/v0.1\/persons",
    "organization_api_url": "http:\/\/za-peoples-assembly.popit.mysociety.org\/api\/v0.1\/organizations",
    "membership_api_url": "http:\/\/za-peoples-assembly.popit.mysociety.org\/api\/v0.1\/memberships",
    "image_proxy_url": "http:\/\/za-peoples-assembly.popit.mysociety.org\/image-proxy\/"
  }
}
```

You could then view a list of all the people in the database:

``` javascript
// GET http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons

{
  "result": [
    {
      "id": "org.mysociety.za/person/1",
      "family_name": "Swart",
      "given_names": "Steven Nicholas",
      "image": "http://www.parliament.gov.za/content/SWART%20STEVEN%20NICHOLAS.jpg",
      "slug": "steven-nicholas-swart",
      "honorific_prefix": "Mr",
      "name": "Steven Nicholas Swart",
      "memberships": [],
      "links": [],
      "contact_details": [
        {
          "type": "email",
          "value": "sswart@parliament.gov.za"
        }
      ],
      "identifiers": [
        {
          "scheme": "za.gov.parliament/person",
          "identifier": "875"
        },
        {
          "scheme": "myreps_person_id",
          "identifier": "5453"
        },
        {
          "scheme": "myreps_id",
          "identifier": "8222"
        }
      ],
      "other_names": []
    },
    // ... more person entries ...
  ]
}
```

Or view the record for an individual person in the database:

``` javascript
// GET http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons/org.mysociety.za/person/104

{
  "result": {
    "id": "org.mysociety.za/person/104",
    "family_name": "Sisulu",
    "given_names": "Max Vuyisile",
    "image": "http://www.parliament.gov.za/content/SISULU%20MAX%20VUYISILE.jpg",
    "slug": "max-vuyisile-sisulu",
    "honorific_prefix": "Mr",
    "name": "Max Vuyisile Sisulu",
    "memberships": []
    "links": []
    "contact_details": [
      {
        "type": "email",
        "value": "speaker@parliament.gov.za"
      },
      {
        "note": "Session Fax Number",
        "type": "fax",
        "value": "(021) 461 9462"
      },
      {
        "note": "Session Phone Number",
        "type": "voice",
        "value": "(021) 403 2595/3812"
      }
    ],
    "identifiers": [
      {
        "scheme": "za.gov.parliament/person",
        "identifier": "629"
      },
      {
        "scheme": "myreps_person_id",
        "identifier": "5428"
      },
      {
        "scheme": "myreps_id",
        "identifier": "8172"
      }
    ],
    "other_names": []
  }
}

```

## Viewing API responses in the browser.

The API returns [JSON](http://en.wikipedia.org/wiki/JSON) - a data format that is easily usable in all programming languages. It is possible to view JSON in your browser (and easily follow embedded links) if you have one of the following extensions installed:

  * [JSONView](https://chrome.google.com/webstore/detail/chklaanhfefbnpoihckbnefhakgolnmc) for Chrome
  * [JSONView](https://addons.mozilla.org/en-US/firefox/addon/jsonview/) for FireFox
  * [Not sure it can be done easily](http://stackoverflow.com/questions/2483771) for Internet Explorer :(
  * Try a search for "JSON Viewer <your browser name>" for other browsers.
