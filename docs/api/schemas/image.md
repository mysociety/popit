---
title: Image Schema
layout: default
---

If a document has images associated with it they will be in the results. In the meta for the image will be a url that can be used to retrieve the image - either from our server (if the image was uploaded) or from the URL that was stored.

This url is of the raw image that was uploaded. If you need it in a different size you should use the built in image proxy to resize and convert the image as required. Note that this will only work for images served from the same domain as the image proxy, so it will not work for images hosted elsewhere.

The base url to the image proxy is given in the meta on the API entry page (`/api/v1` on your instance). Documentation on how to use the proxy is available on the [proxy code's GitHub page](https://github.com/mysociety/node-connect-image-proxy).
