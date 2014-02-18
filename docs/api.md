---
title: API
description: The API allows you to easily access all the data stored in PopIt from your code or other websites.
layout: default
---

The PopIt API offers a JSON interface for accessing and manipulating People, Organizations, Memberships and Posts that are stored in an instance. Every PopIt instance has an API that makes almost all the data stored in it accessible programatically. You can access the API by visiting `/api/v0.1` in your instance, e.g. [http://za-peoples-assembly.popit.mysociety.org/api/v0.1/](http://za-peoples-assembly.popit.mysociety.org/api/v0.1/).

## Versioning

There is a version string in the API url, currently `v0.1`. This will be updated if the API undergoes significant changes that breaks backwards compatibility.

## API collections

The API allows you to query four types of collection, **persons**, **organizations**, **memberships** and **posts**. Anywhere in the documentation you see `:collection` you can replace it with one of those four types.

- http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons
- http://za-peoples-assembly.popit.mysociety.org/api/v0.1/organizations
- http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships
- http://za-peoples-assembly.popit.mysociety.org/api/v0.1/posts

## Responses

JSON objects are always returned in the response. These will have the form:

### For a collection
```json
{
  "result": [
    // list of {} results here
  ]
}
```

### For a single document

```json
{
  "result": {
    // The data stored for the person
  }
}
```

The exact format of the response depends on the schema of the collection you are looking at. Please see [Schemas](/docs/api/schemas) for more details.

### Errors

If something goes wrong there will be an `error` or `errors` key that will explain the error. Often an HTTP error code will also be used (eg **404** if a result cannot be found).

## Record ids

You can provide an `id` field for a record when creating it. If the dataset you're adding to PopIt already has a natural primary key then it makes sense to use that as the `id` attribute. If you don't have a primary key that you want to use then simply omit the `id` property when creating the record and one will be generated for you and returned in the response.

## Pagination

Results are limited to 30 items by default. You can access further pages by specifying the `?page` parameter, up to a maximum of 1000 pages. You can also set a custom number of results per page (up to 100) with the `?per_page` parameter.

## Examples

To view a list of all the people (**persons**) in the database:

http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons

```json
{
  "result": [
    {
      "html_url": "http://za-peoples-assembly.popit.mysociety.org/persons/steven-nicholas-swart",
      "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons/org.mysociety.za/person/1",
      "other_names": [],
      "identifiers": [
        {
          "identifier": "875",
          "scheme": "za.gov.parliament/person"
        },
        {
          "identifier": "5453",
          "scheme": "myreps_person_id"
        },
        {
          "identifier": "8222",
          "scheme": "myreps_id"
        }
      ],
      "contact_details": [
        {
          "value": "sswart@parliament.gov.za",
          "type": "email"
        }
      ],
      "links": [],
      "id": "org.mysociety.za/person/1",
      "family_name": "Swart",
      "given_names": "Steven Nicholas",
      "image": "http://www.parliament.gov.za/content/SWART%20STEVEN%20NICHOLAS.jpg",
      "slug": "steven-nicholas-swart",
      "honorific_prefix": "Mr",
      "name": "Steven Nicholas Swart",
      "memberships": [
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1",
          "contact_details": [],
          "links": [],
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/party/acdp",
          "id": "org.mysociety.za/membership/1"
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1484",
          "contact_details": [],
          "links": [],
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/committee/74",
          "id": "org.mysociety.za/membership/1484"
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1485",
          "contact_details": [],
          "links": [],
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/committee/18",
          "id": "org.mysociety.za/membership/1485"
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1620",
          "contact_details": [],
          "links": [],
          "role": "Alternate Member",
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/committee_pmg/8",
          "id": "org.mysociety.za/membership/1620"
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1727",
          "contact_details": [],
          "links": [],
          "role": "Alternate Member",
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/committee_pmg/16",
          "id": "org.mysociety.za/membership/1727"
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/966",
          "contact_details": [],
          "id": "org.mysociety.za/membership/966",
          "area": {
            "id": "org.mysociety.za/mapit/code/p/WC",
            "name": "Western Cape"
          },
          "label": "Member for Western Cape",
          "organization_id": "org.mysociety.za/house/national-assembly",
          "role": "Member",
          "start_date": "2009-05-06",
          "person_id": "org.mysociety.za/person/1",
          "links": []
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1644",
          "contact_details": [],
          "links": [],
          "role": "Alternate Member",
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/committee_pmg/10",
          "id": "org.mysociety.za/membership/1644"
        },
        {
          "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/2222",
          "contact_details": [],
          "links": [],
          "role": "Alternate Member",
          "person_id": "org.mysociety.za/person/1",
          "organization_id": "org.mysociety.za/committee_pmg/53",
          "id": "org.mysociety.za/membership/2222"
        }
      ]
    },
    // More person objects...
  ]
}
```

Or view the record for an individual person in the database:

http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons/org.mysociety.za/person/104

``` javascript
{
  "result": {
    "html_url": "http://za-peoples-assembly.popit.mysociety.org/persons/max-vuyisile-sisulu",
    "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/persons/org.mysociety.za/person/104",
    "other_names": [],
    "identifiers": [
      {
        "identifier": "629",
        "scheme": "za.gov.parliament/person"
      },
      {
        "identifier": "5428",
        "scheme": "myreps_person_id"
      },
      {
        "identifier": "8172",
        "scheme": "myreps_id"
      }
    ],
    "contact_details": [
      {
        "value": "speaker@parliament.gov.za",
        "type": "email"
      },
      {
        "value": "(021) 461 9462",
        "type": "fax",
        "note": "Session Fax Number"
      },
      {
        "value": "(021) 403 2595/3812",
        "type": "voice",
        "note": "Session Phone Number"
      }
    ],
    "links": [],
    "id": "org.mysociety.za/person/104",
    "family_name": "Sisulu",
    "given_names": "Max Vuyisile",
    "image": "http://www.parliament.gov.za/content/SISULU%20MAX%20VUYISILE.jpg",
    "slug": "max-vuyisile-sisulu",
    "honorific_prefix": "Mr",
    "name": "Max Vuyisile Sisulu",
    "memberships": [
      {
        "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/1005",
        "contact_details": [],
        "links": [],
        "role": "Speaker",
        "person_id": "org.mysociety.za/person/104",
        "organization_id": "org.mysociety.za/house/national-assembly",
        "id": "org.mysociety.za/membership/1005"
      },
      {
        "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/104",
        "contact_details": [],
        "links": [],
        "person_id": "org.mysociety.za/person/104",
        "organization_id": "org.mysociety.za/party/anc",
        "id": "org.mysociety.za/membership/104"
      },
      {
        "url": "http://za-peoples-assembly.popit.mysociety.org/api/v0.1/memberships/org.mysociety.za/membership/743",
        "id": "org.mysociety.za/membership/743",
        "organization_id": "org.mysociety.za/house/national-assembly",
        "role": "Member",
        "person_id": "org.mysociety.za/person/104",
        "label": "Member",
        "start_date": "2009-05-06",
        "links": [],
        "contact_details": []
      }
    ]
  }
}
```

#### Viewing API responses in the browser.

The API returns [JSON](http://en.wikipedia.org/wiki/JSON) - a data format that is easily usable in all programming languages. It is possible to view JSON in your browser (and easily follow embedded links) if you have one of the following extensions installed:

  * [JSONView](https://chrome.google.com/webstore/detail/chklaanhfefbnpoihckbnefhakgolnmc) for Chrome
  * [JSONView](https://addons.mozilla.org/en-US/firefox/addon/jsonview/) for FireFox
  * [Not sure it can be done easily](http://stackoverflow.com/questions/2483771) for Internet Explorer :(
  * Try a search for "JSON Viewer <your browser name>" for other browsers.
