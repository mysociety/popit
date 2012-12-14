---
title: Partial Date Schema
description: 
layout: default
---

Often a date is not precisely known - so you may only know the year of a person date of birth. Partial dates allow you to represent this uncertainty.

Each date has a `start` and `end` component. These represent the start and end of the range that this date covers. So if you wanted to represent 1950 as a partial date you would set `start` to `1950-01-01` and  `end` to `1950-12-31`.

## Examples

``` javascript
// a specific day
{
  "formatted": "Apr 1, 2012",
  "end": "2012-04-01T00:00:00.000Z",
  "start": "2012-04-01T00:00:00.000Z"
}
```

``` javascript
// 1990 (month and day unknown)
{
  "formatted": "Jan 1 - Dec 31, 1990",
  "end": "1990-12-31T00:00:00.000Z",
  "start": "1990-01-01T00:00:00.000Z"
}
```

## Formatting

There is an additional field `formatted` that is returned by the API. This is a text string that can be used to represent the date to humans. It is generated automatically. When writing a partial date it will be ignored.

## To be added

The [formatting could be improved](https://github.com/mysociety/popit/issues/208), and it would be nice [not to have a time component](https://github.com/mysociety/popit/issues/207) for dates.