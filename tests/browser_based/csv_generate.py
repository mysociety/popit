#!/usr/bin/env python3.1

# random unicode from http://stackoverflow.com/questions/1477294/generate-random-utf-8-string-in-python
# From Table 3–7 of the Unicode Standard 5.0.0

import random
from pprint import pprint

def byte_range(first, last):
    return list(range(first, last+1))

first_values = byte_range(0x00, 0x7F) + byte_range(0xC2, 0xF4)
trailing_values = byte_range(0x80, 0xBF)

def random_utf8_seq():
    first = random.choice(first_values)
    if first <= 0x7F:
        return bytes([first])
    elif first <= 0xDF:
        return bytes([first, random.choice(trailing_values)])
    elif first == 0xE0:
        return bytes([first, random.choice(byte_range(0xA0, 0xBF)), random.choice(trailing_values)])
    elif first == 0xED:
        return bytes([first, random.choice(byte_range(0x80, 0x9F)), random.choice(trailing_values)])
    elif first <= 0xEF:
        return bytes([first, random.choice(trailing_values), random.choice(trailing_values)])
    elif first == 0xF0:
        return bytes([first, random.choice(byte_range(0x90, 0xBF)), random.choice(trailing_values), random.choice(trailing_values)])
    elif first <= 0xF3:
        return bytes([first, random.choice(trailing_values), random.choice(trailing_values), random.choice(trailing_values)])
    elif first == 0xF4:
        return bytes([first, random.choice(byte_range(0x80, 0x8F)), random.choice(trailing_values), random.choice(trailing_values)])

def random_unicode():
    return str(random_utf8_seq(), "utf8")

def generate_random_string():
    a = "".join(random_unicode() for i in range(5));
    ignore = "@'\""
    for i in ignore:
        a.replace(i, 'a');
    return a

def rs2():
    return '"'+generate_random_string()+'"'

rs = generate_random_string


a = [[rs2(), '"'+rs()+'@'+rs()+'.com"', rs2(), '"12/2/1974"', rs2(), rs2(), '"http://www.'+rs()+'.com"'] for x in range(30)]
csv = "\n".join([",".join(x) for x in a])

header = 'Name,Email,"Party","Date of Birth","Place of Birth",University,URL\n';

print(header+csv);