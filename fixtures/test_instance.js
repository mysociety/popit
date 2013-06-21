"use strict"; 

var ObjectId = require('pow-mongodb-fixtures').createObjectId;

exports.users = [
    {   email:           'owner@example.com',
        hashed_password: '$2a$10$QS8CzHB2TG/S68sfdeKqCe5X0r2/XJjFw2ozFy0Ahm6.HJKrZm3sG', // 'secret'
     },
];

exports.persons = [
  {
          "__v" : 1,
          "_id" : "4f9ea1306e8770d854c45a1d",
          "name" : "George Bush",
          "_internal": {
            "name_dm" : [ "JRJ", "KRK", "PX", "PX", "george", "bush" ],
            "name_words" : [ "george", "bush" ],
          },
          "slug" : "george-bush",
          "summary" : "41th President of the United States"
  },
  {
          "__v" : 1,
          "_id" : "4f9ea1316e8770d854c45a1e",
          "links" : [
              {
                  "url" : "http://www.clintonfoundation.org/",
                  "note" : "William J. Clinton Foundation"
              }
          ],
          "name" : "Bill Clinton",
          "_internal": {
            "name_dm" : [ "PL", "PL", "KLNT", "KLNT", "bill", "clinton" ],
            "name_words" : [ "bill", "clinton" ],
          },
          "slug" : "bill-clinton",
          "summary" : "42nd President of the United States"
  },
  {
          "__v" : 1,
          "_id" : "4f9ea1316e8770d854c45a1f",
          "name" : "George W. Bush",
          "_internal": {
            "name_dm" : [ "JRJ", "KRK", "", "", "PX", "PX", "george", "w.", "bush" ],
            "name_words" : [ "george", "w.", "bush" ],
          },
          "slug" : "george-w-bush",
          "summary" : "43rd President of the United States",
          "images": [
            {
              "_id": "50d1bd87d7445531d1000007",
              "url": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/George-W-Bush.jpeg/453px-George-W-Bush.jpeg",
              "created": "2012-12-19T13:13:43.714Z",
            },
          ],
  },
  {
          "__v" : 1,
          "_id" : "4f9ea1326e8770d854c45a20",
          "name" : "Barack Obama",
          "_internal": {
            "name_dm" : [ "PRK", "PRK", "APM", "APM", "barack", "obama" ],
            "name_words" : [ "barack", "obama" ],
          },
          "slug" : "barack-obama",
          "summary" : "44th President of the United States",
  }
];

exports.organizations = [
  {
    "_id": "4f9ea1326e8770d854c45a21",
    name: "United States Government",
    slug: "united-states-government",
    summary: "The government of the United States of America is the federal government of the constitutional republic of fifty states that constitute the United States of America"
  },
];

exports.memberships = [
  {
    "_id":        "4f9ea1326e8770d854c45a22",
    title:        "President",
    person:       "4f9ea1306e8770d854c45a1d", // george-bush
    organization: "4f9ea1326e8770d854c45a21",
  },
  {
    "_id":        "4f9ea1326e8770d854c45a23",
    title:        "President",
    person:       "4f9ea1316e8770d854c45a1e", // bill-clinton
    organization: "4f9ea1326e8770d854c45a21",
  },
  {
    "_id":        "4f9ea1326e8770d854c45a24",
    title:        "President",
    person:       "4f9ea1316e8770d854c45a1f", // george-w-bush
    organization: "4f9ea1326e8770d854c45a21",
  },
  {
    "_id":        "4f9ea1326e8770d854c45a25",
    title:        "President",
    person:       "4f9ea1326e8770d854c45a20", // barack-obama
    organization: "4f9ea1326e8770d854c45a21",
  },
];

