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

## start and end

These fields represent the start and the end of the time range that this partial date represents. If they are the same then the date is known precisely.

Both are represented using the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) format - which is generally `YYYY-MM-DDTHH:MM:SSZ`. It is possible to save using just 'YYYY-MM-DD' in which case it will be expanded and the timezone set to UTC before being saved to the database.

In the admin this complexity is hidden from the user by providing a custom input that translates user input to the dates.

## Formatting

There is an additional field `formatted` that is returned by the API. This is a text string that can be used to represent the date to humans. It is generated automatically. When writing a partial date it will be ignored.

## To be added

The [formatting could be improved](https://github.com/mysociety/popit/issues/208), and it would be nice [not to have a time component](https://github.com/mysociety/popit/issues/207) for dates.