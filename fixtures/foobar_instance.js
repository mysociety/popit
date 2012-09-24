var ObjectId = require('pow-mongodb-fixtures').createObjectId;

exports.users = [
    {   email:           'owner@example.com',
        hashed_password: '$2a$10$QS8CzHB2TG/S68sfdeKqCe5X0r2/XJjFw2ozFy0Ahm6.HJKrZm3sG', // 'secret'
     },
];

exports.people = [
  {
          "__v" : 1,
          "_id" : ObjectId("4f9ea1306e8770d854c45a1d"),
          "name" : "George Bush",
          "name_dm" : [
                  "JRJ",
                  "KRK",
                  "PX",
                  "PX",
                  "george",
                  "bush"
          ],
          "name_words" : [
                  "george",
                  "bush"
          ],
          "slug" : "george-bush",
          "summary" : "41th President of the United States"
  },
  {
          "__v" : 1,
          "_id" : ObjectId("4f9ea1316e8770d854c45a1e"),
          "links" : [
                  {
                          "_id" : ObjectId("4f9ea1326e8770d854c45a26"),
                          "url" : "http://www.clintonfoundation.org/",
                          "comment" : "William J. Clinton Foundation"
                  }
          ],
          "name" : "Bill Clinton",
          "name_dm" : [
                  "PL",
                  "PL",
                  "KLNT",
                  "KLNT",
                  "bill",
                  "clinton"
          ],
          "name_words" : [
                  "bill",
                  "clinton"
          ],
          "slug" : "bill-clinton",
          "summary" : "42nd President of the United States"
  },
  {
          "__v" : 1,
          "_id" : ObjectId("4f9ea1316e8770d854c45a1f"),
          "name" : "George W. Bush",
          "name_dm" : [
                  "JRJ",
                  "KRK",
                  "",
                  "",
                  "PX",
                  "PX",
                  "george",
                  "w.",
                  "bush"
          ],
          "name_words" : [
                  "george",
                  "w.",
                  "bush"
          ],
          "slug" : "george-w-bush",
          "summary" : "43rd President of the United States"
  },
  {
          "__v" : 1,
          "_id" : ObjectId("4f9ea1326e8770d854c45a20"),
          "name" : "Barack Obama",
          "name_dm" : [
                  "PRK",
                  "PRK",
                  "APM",
                  "APM",
                  "barack",
                  "obama"
          ],
          "name_words" : [
                  "barack",
                  "obama"
          ],
          "slug" : "barack-obama",
          "summary" : "44th President of the United States"
  }
];

exports.organisations = [
  {
    "_id": ObjectId("4f9ea1326e8770d854c45a21"),
    name: "United States Government",
    slug: "united-states-government",
  },
];

exports.positions = [
  {
    "_id":        ObjectId("4f9ea1326e8770d854c45a22"),
    title:        "President",
    person:       ObjectId("4f9ea1306e8770d854c45a1d"), // george-bush
    organisation: ObjectId("4f9ea1326e8770d854c45a21"),
  },
  {
    "_id":        ObjectId("4f9ea1326e8770d854c45a23"),
    title:        "President",
    person:       ObjectId("4f9ea1316e8770d854c45a1e"), // bill-clinton
    organisation: ObjectId("4f9ea1326e8770d854c45a21"),
  },
  {
    "_id":        ObjectId("4f9ea1326e8770d854c45a24"),
    title:        "President",
    person:       ObjectId("4f9ea1316e8770d854c45a1f"), // george-w-bush
    organisation: ObjectId("4f9ea1326e8770d854c45a21"),
  },
  {
    "_id":        ObjectId("4f9ea1326e8770d854c45a25"),
    title:        "President",
    person:       ObjectId("4f9ea1326e8770d854c45a20"), // barack-obama
    organisation: ObjectId("4f9ea1326e8770d854c45a21"),
  },
];

