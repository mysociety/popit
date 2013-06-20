---
title: Writing to the API
description: 
layout: default
---

It should be possible to manage all the public data stored in a PopIt instance using the API. This includes adding, updating and deleting records.

(Note - there is currently some data that cannot be managed using the API, notably image uploads.)

To edit data you will need to [authenticate your requests](../auth).

## Method summary

PopIt closely follows the suggested REST method behaviours, but with a few deviations:

<table>
  <tr>
    <td>&nbsp;</td>
    <th>GET</th>
    <th>PUT</th>
    <th>POST</th>
    <th>DELETE</th>
  </tr>
  <tr>
    <th>Collection endpoint:</th>
    <td>List documents</td>
    <td>Not implemented</td>
    <td>Create document</td>
    <td>Not implemented</td>
  </tr>
  <tr>
    <th>Document endpoint:</th>
    <td>Retrieve document</td>
    <td>Update document</td>
    <td>Not implemented</td>
    <td>Delete document</td>
  </tr>
</table>

### Not Implemented Methods

These are `PUT` and `DELETE` on collections. Implementing these would mean that you could replace an entire collection, or delete it, in one operation. It is not likely that this is something that you'll want to do often, and the penalty for doing it by mistake is high.

A `POST` to a document endpoint means that you should treat the document as a collection and add an entry to it. For PopIt this makes no sense and so it is not implemented.

All the not implemented methods will return the status code `405 Method Not Allowed`.

### Listing documents in a collection

If you go to a url such as `/api/v0.1/person` you will then get an array of all the entries in the database. Each item in the array is the complete document so there is no need to request the document again for more details.

You can filter the results using query arguments - eg `/api/v0.1/person?name=joe`.

See also the notes on reading a single document below.

Currently there is no pagination - this is [planned](https://github.com/mysociety/popit/issues/166) however.

### Reading a single document

A `GET` request to something like `/api/v0.1/<collection-name>/<id>` will return that entry.

For the `person` and `organisation` collections the related positions are not included in the result. But there is a `positions_api_url` entry in the meta that will list them all.


### Creating a new document in a collection

If you `POST` to a collection you will create a new entry.

This is an example of sending a request using [cURL](http://curl.haxx.se/) (a command line tool). The command is first, the response received from the server is printed afterwards.

``` bash

$ curl                                                 \
    --user you@example.com:s3cr3t                      \
    --request POST                                     \
    --header "Accept: application/json"                \
    --header "Content-Type: application/json"          \
    --data '{ "name": "Joe Bloggs" }'                  \
    http://test.127.0.0.1.xip.io:3000/api/v0.1/person

{
  "result": {
    "id": "50d1f2e1c03858f9f6000006",
    "name": "Joe Bloggs",
    "slug": "joe-bloggs",
    "death_date": {
      "formatted": "",
      "end": null,
      "start": null
    },
    "birth_date": {
      "formatted": "",
      "end": null,
      "start": null
    },
    "images": [],
    "links": [],
    "contact_details": [],
    "other_names": [],
    "meta": {
      "api_url": "http://test.127.0.0.1.xip.io:3000/api/v0.1/person/50d1f2e1c03858f9f6000006",
      "edit_url": "http://test.127.0.0.1.xip.io:3000/person/joe-bloggs",
      "positions_api_url": "http://test.127.0.0.1.xip.io:3000/api/v0.1/position?person=50d1f2e1c03858f9f6000006"
    }
  }
}
```

Note that the request was authenticated using the email address and password of the user.

The `Content-Type` is set to `application/json`. This allows nested values to be correctly sent. The `Accept` header is also set to JSON, but this is not strictly necessary as PopIt will default to JSON responses (and it is currently the only format supported).

### Updating an existing document

Updating a document is done by sending the whole document in the `PUT` request. Any fields that are omitted in the request will be removed, and replaced with the default.

When you put the order of items in arrays (like images) will be changed as well if needed.

### Deleting a document

Sending a `DELETE` request to a document url will cause that document to be deleted. An empty (`{}`) response will be returned with status `200 OK`.

```bash
$ curl                                     \
    --user you@example.com:s3cr3t          \
    -X DELETE                              \
    http://test.127.0.0.1.xip.io:3000/api/v0.1/person/50d1f2e1c03858f9f6000006

{}
```
