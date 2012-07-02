#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import random
from pprint import pprint

def random_unicode():
    ascii = [chr(x) for x in range(32,126) if not x in [34, 39, 96]]
    unic = list("äüöᴀaᴈᴉᴊᴋᴌᴍᴎᴏⓚĦß")
    a = ascii + unic
    return a[random.randint(0, len(a)-1)]

def generate_random_string():
    return "".join(random_unicode() for i in range(random.randint(3, 8)));

def rs2():
    return '"'+generate_random_string()+'"'

rs = generate_random_string

a = [[rs2(), '"'+rs()+'@'+rs()+'.com"', rs2(), '"12/2/1974"', rs2(), rs2(), '"http://www.'+rs()+'.com"'] for x in range(100)]
csv = "\n".join([",".join(x) for x in a])

header = 'Name,Email,"Party","Date of Birth","PopitID",University,URL\n';

print(header+csv);