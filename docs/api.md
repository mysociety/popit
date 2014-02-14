---
title: API
description: The API allows you to easily access all the data stored in PopIt from your code or other websites.
layout: default
---

The PopIt API offers a JSON interface for accessing and manipulating People, Organizations, Memberships and Posts that are stored in an instance. You can access the API by visiting `/api/v0.1` in your instance, e.g. [http://za-peoples-assembly.popit.mysociety.org/api/v0.1/](http://za-peoples-assembly.popit.mysociety.org/api/v0.1/).

There is a version string in the API url, currently `v0.1`. This will be updated if the API undergoes significant changes that breaks backwards compatibility.

When you make a query the returned data will always be a hash. There will be a `result` key that contains the data you've requested.

### Errors

If something goes wrong there will be an `error` or `errors` key that will explain the error. Often an HTTP error code will also be used (eg **404** if a result cannot be found).

### Record ids

You can provide an `id` field for a record when creating it. If the dataset you're adding to PopIt already has a natural primary key then it makes sense to use that as the `id` attribute. If you don't have a primary key that you want to use then simply omit the `id` property when creating the record and one will be generated for you and returned in the response.
