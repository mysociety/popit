---
title: API Auth
layout: default
---

For write operations on the API you need to be authenticated. This can  either be done using [Basic Authentication](http://en.wikipedia.org/wiki/Basic_access_authentication) or by cookie auth. Basic is probably best for scripts and programatic access, cookie based for Ajax calls etc.

We will probably need to add token based auth  [(#113)](https://github.com/mysociety/popit/issues/113) in the future, as well as adding CSRF protection  [(#112)](https://github.com/mysociety/popit/issues/112).
