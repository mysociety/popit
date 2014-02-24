"use strict"; 

var ObjectId = require('pow-mongodb-fixtures').createObjectId;

exports.users = [
    {   email:           'owner@example.com',
        hashed_password: '$2a$10$QS8CzHB2TG/S68sfdeKqCe5X0r2/XJjFw2ozFy0Ahm6.HJKrZm3sG', // 'secret'
     },
];

exports.persons = [
  {
          "_id" : "george-bush",
          "name" : "George Bush",
          "_internal": {
            "name_dm" : [ "JRJ", "KRK", "PX", "PX", "george", "bush" ],
            "name_words" : [ "george", "bush" ],
          },
          "summary" : "41th President of the United States"
  },
  {
          "_id" : "bill-clinton",
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
          "summary" : "42nd President of the United States"
  },
  {
          "_id" : "george-w-bush",
          "name" : "George W. Bush",
          "_internal": {
            "name_dm" : [ "JRJ", "KRK", "", "", "PX", "PX", "george", "w.", "bush" ],
            "name_words" : [ "george", "w.", "bush" ],
          },
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
          "_id" : "barack-obama",
          "name" : "Barack Obama",
          "_internal": {
            "name_dm" : [ "PRK", "PRK", "APM", "APM", "barack", "obama" ],
            "name_words" : [ "barack", "obama" ],
          },
          "summary" : "44th President of the United States",
  }
];

exports.organizations = [
  {
    "_id": "united-states-government",
    name: "United States Government",
    summary: "The government of the United States of America is the federal government of the constitutional republic of fifty states that constitute the United States of America"
  },
];

exports.posts = [
  {
    "_id": "post1",
     label: "President",
     role: "President",
     organization_id: "4f9ea1326e8770d854c45a21"
  },
  {
    "_id": "post2",
     label: "Vice-President",
     role: "Vice-President",
     organization_id: "4f9ea1326e8770d854c45a21"
  },
];

exports.memberships = [
  {
    "_id":        "4f9ea1326e8770d854c45a22",
    role:         "President",
    person_id:    "george-bush",
    organization_id: "united-states-government",
  },
  {
    "_id":        "4f9ea1326e8770d854c45a23",
    role:         "President",
    person_id:    "bill-clinton",
    organization_id: "united-states-government",
  },
  {
    "_id":        "4f9ea1326e8770d854c45a24",
    role:         "President",
    person_id:   "george-w-bush",
    organization_id: "united-states-government",
  },
  {
    "_id":        "4f9ea1326e8770d854c45a25",
    role:         "President",
    person_id:    "barack-obama",
    organization_id: "united-states-government",
  },
];

