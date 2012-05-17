var id = require('pow-mongodb-fixtures').createObjectId;

exports.users = [
    {   email:           'test@example.com',
        hashed_password: '$2a$10$QS8CzHB2TG/S68sfdeKqCe5X0r2/XJjFw2ozFy0Ahm6.HJKrZm3sG', // 'secret'
     },
];

exports.people = [
  {
    "_id": id("4f9ea1306e8770d854c45a1d"),
    name: "George Bush",
    slug: "george-bush",
    summary: "41th President of the United States",
  },
  {
    "_id": id("4f9ea1316e8770d854c45a1e"),
    name: "Bill Clinton",
    slug: "bill-clinton",
    summary: "42nd President of the United States",
    links: [
      {
        "_id": id("4f9ea1326e8770d854c45a26"),
        url: "http://www.clintonfoundation.org/",
        comment: "William J. Clinton Foundation",
       }
    ],
  },
  {
    "_id": id("4f9ea1316e8770d854c45a1f"),
    name: "George W. Bush",
    slug: "george-w-bush",
    summary: "43rd President of the United States",
  },
  {
    "_id": id("4f9ea1326e8770d854c45a20"),
    name: "Barack Obama",
    slug: "barack-obama",
    summary: "44th President of the United States",
  },
];

exports.organisations = [
  {
    "_id": id("4f9ea1326e8770d854c45a21"),
    name: "United States Government",
    slug: "united-states-government",
  },
];

exports.positions = [
  {
    "_id":        id("4f9ea1326e8770d854c45a22"),
    title:        "President",
    person:       id("4f9ea1326e8770d854c45a1d"), // george-bush
    organisation: id("4f9ea1326e8770d854c45a21"),
  },
  {
    "_id":        id("4f9ea1326e8770d854c45a23"),
    title:        "President",
    person:       id("4f9ea1326e8770d854c45a1e"), // bill-clinton
    organisation: id("4f9ea1326e8770d854c45a21"),
  },
  {
    "_id":        id("4f9ea1326e8770d854c45a24"),
    title:        "President",
    person:       id("4f9ea1326e8770d854c45a1f"), // george-w-bush
    organisation: id("4f9ea1326e8770d854c45a21"),
  },
  {
    "_id":        id("4f9ea1326e8770d854c45a25"),
    title:        "President",
    person:       id("4f9ea1326e8770d854c45a20"), // barack-obama
    organisation: id("4f9ea1326e8770d854c45a21"),
  },
];

