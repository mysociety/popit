---
title: Data Schemas Overview
description: 
layout: default
---

All entries stored in PopIt follow a schema that provides a standard layout for the data, and some validation. However using the API it is possible to augment the schema with additional fields - so if you want you can store extra data in them.

Each schema is described in the sub sections, as are the sub schemas that are reused in various places.

## Top level schemas

  * [People and Organisations](person-and-organisation) are the primary objects stored in PopIt. Their schemas are very similar so explained together.
  * [Positions](position) are the links between people and organisations (e.g. jobs, memberships, etc)

## Sub Schemas

There are recurring parts of the main schemas - for example both people and organisations can have contact details. These shared sub schemas are documented separately:

  * [Images](image)
  * [Contact Details](contact-detail)
  * [Links](link)

## Additional information

  * [Meta](meta) (additional info)
