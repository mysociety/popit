---
title: Data Schemas Overview
description: 
layout: default
---

All textual entries stored in PopIt follow the [Popolo
schema](http://popoloproject.com/). You can also add additional fields on top
of this using the admin interface or the API.

In addition to the current Popolo schemas we have added an area object on
Memberships and Posts.

## Images

Images, as they can be stored locally, are dealt with slightly differently.
There is also a proxy that lets the API consumer request the image sized
correctly for their needs.

### Schema

For an image stored on the instance:

``` javascript
{
  "_id": "50ca0fcf32b4846962000006",
  "mime_type": "image/jpeg",
  "created": "2012-12-13T17:26:39.326Z",
  "meta": {
    "image_url": "http://instance.example.org/persons/barack-obama/images/50ca0fcf32b4846962000006",
    "can_use_image_proxy": true
  }
}
```

For an image stored elsewhere:

``` javascript
{
  "_id": "50ca10fe32b4846962000007",
  "url": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Official_portrait_of_Barack_Obama.jpg/220px-Official_portrait_of_Barack_Obama.jpg",
  "created": "2012-12-13T17:31:42.272Z",
  "meta": {
    "image_url": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Official_portrait_of_Barack_Obama.jpg/220px-Official_portrait_of_Barack_Obama.jpg",
    "can_use_image_proxy": false
  }
}
```

### For uploaded images

Images can be uploaded into PopIt by using the admin pages. It is not currently
possible to do this using the API.

#### mime_type

The mime_type of the uploaded file.

### For remote url images

#### url

The url that the image is hosted at.

To link to an image you should use the `meta.image_url` value which will return
the correct image url regardless.

### Image Proxy

Because it is not possible to know how API users intend to use the images we've
not tried to provide them in a set of standard sizes. The url given always
points to the full size image that was uploaded/linked to. If you want a
different size then there is an image proxy that can provide this.

The base url to the image proxy is given in the meta on the API entry page
(`/api/v0.1` on your instance). Documentation on how to use the proxy is
available on the [proxy code's GitHub
page](https://github.com/mysociety/node-connect-image-proxy).

The proxy can only be used for images uploaded to the instance (ie that have
the same host name). This is done so that it is not an open proxy that could be
abused. There is a boolean in the meta that let's you know if you can pass the
url to the proxy to resize: `meta.can_use_image_proxy`.

Note: The image proxy may be changed so that it can be used for any URL. Let us
know if you'd find this helpful.

### Future additions

We'll be adding fields to specify the appropriate attribution and licensing for
images ([issue #51](https://github.com/mysociety/popit/issues/51)). 

