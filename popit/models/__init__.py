from common import *
from people import *
from organisations import *
from positions import *

"""

TODO - make the following more cohesive

Notes on design of the models:

Needs to be flexible enough to deal with events that occur in the real world -
eg:

 * organisations/people changing their names * people holding several positions

 * uncertainty about some information - such as dates

Many entries can have start and end dates. This allows the model to represent
not only the current state, but also the state at any time in the past. This is
very useful.

It is also possible for people to have several roles of the same kind - for
example party memberships. This is needed to represent real world situations.
Also, for a parliament like the UK's, we store the political situation and the
party membership seperately. This is so that it is possible for an MP to change
party midterm - a rare event but one that does happen.

Slugs

Many entries have a slug. The slug is _NOT_ intended to be a permanent or unique
identifier for the entry. It may change, and the several entries may have the
same slug. The slug is provided as a conveniance only.

To identify an entry you should always use the id which is guaranteed unique and
permanent.

"""