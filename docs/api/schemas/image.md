---
title: Image Schema
layout: default
---

It is intended that images should be stored very flexibly, either as uploads into the instance or as URLs to images stored elsewhere. There is also a proxy that lets the API consumer request the image sized correctly for their needs.

## Schema

For an image stored on the instance:

``` javascript
{
  "_id": "50ca0fcf32b4846962000006",
  "mime_type": "image/jpeg",
  "created": "2012-12-13T17:26:39.326Z",
  "meta": {
    "image_url": "http://instance.example.org/person/barack-obama/images/50ca0fcf32b4846962000006",
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

## ID

Please ignore this field - it will [soon be removed](https://github.com/mysociety/popit/issues/232) from the API.

## url

This is an optional field - only present when the image is hosted somewhere other than on the instance.

To link to an image you should use the `meta.image_url` value which will return the correct image url regardless.

## Image Proxy

Because it is not possible to know how API users intend to use the images we've not tried to provide them in a set of standard sizes. The url given always points to the full size image that was uploaded. If you want a different size then there is an image proxy that can provide this.

The base url to the image proxy is given in the meta on the API entry page (`/api/v1` on your instance). Documentation on how to use the proxy is available on the [proxy code's GitHub page](https://github.com/mysociety/node-connect-image-proxy).

The proxy can only be used for images uploaded to the instance (ie that have the same host name). This is done so that it is not an open proxy that could be abused. There is a boolean in the meta that let's you know if you can pass the url to the proxy to resize: `meta.can_use_image_proxy`.

## Future additions

We'll be adding fields to specify the appropriate attribution and licensing for images ([issue #51](https://github.com/mysociety/popit/issues/51)). 
