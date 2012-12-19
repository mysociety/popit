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
    <td>Not implemented</td>
    <td>Update document</td>
    <td>Delete document</td>
  </tr>
</table>

**NOTE** These docs are currently left empty as there is a discussion concerning changing the API to be much simpler. See [ticket #219 on GitHub](https://github.com/mysociety/popit/issues/219). 
