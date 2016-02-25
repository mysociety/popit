#!/usr/bin/python

from __future__ import print_function, unicode_literals

import argparse
from datetime import date, timedelta
import re
from subprocess import Popen, PIPE, check_call
import requests
import sys

parser = argparse.ArgumentParser()
parser.add_argument(
    '--commit',
    action='store_true',
    help='Actually delete the MongoDB databases and Elastisearch indexes'
)
args = parser.parse_args()

# Find all mongodb database names:

popen = Popen(['mongo', '--quiet'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
stdout, stderr = popen.communicate(input='''
    var dbs = db.adminCommand('listDatabases').databases;
    for (i = 0; i < dbs.length; i++) {
         print(dbs[i].name);
    }
''')

if popen.returncode != 0:
    print("Listing mongo databases failed, exiting.")
    sys.exit(1)

mongo_databases = stdout.split()

def remove_database(database_name):
    if args.commit:
        print("Removing:", database_name)
        check_call(
            ['mongo', database_name, '--quiet', '--eval', 'db.dropDatabase()']
        )
        es_index_url = 'http://localhost:9200/{0}/'.format(database_name)
        r = requests.delete(es_index_url)
        response_data = r.json
        if response_data.get('status') == 404:
            msg = "The Elasticsearch index {0} wasn't found"
            print(msg.format(database_name))
        elif not response_data.get('ok'):
            raise Exception("DELETE on {0} failed: {1}".format(
                es_index_url, response_data
            ))
    else:
        msg = "Would remove {0}, but --commit wasn't specified"
        print(msg.format(database_name))

for popit_site in ('popit', 'popit_staging'):
    for popit_instance in ('kenyan-politicians', 'za-peoples-assembly', 'za-new-import'):
        if popit_site == 'popit':
            fmt = "http://{0}.popit.mysociety.org"
            base_api_url = fmt.format(popit_instance)
        elif popit_site == 'popit_staging':
            fmt = "http://{0}.popit.staging.mysociety.org"
            base_api_url = fmt.format(popit_instance)
        else:
            raise Exception("Unknown popit site: {0}".format(popit_site))
        # Now get the in-use database name to make sure we don't
        # remove that one:
        url = base_api_url + '/api/v0.1'
        api_info = requests.get(url).json
        api_info = requests.get(url).json
        if not api_info:
            msg = "No database metadata found at {0} - skipping"
            print(msg.format(url))
            continue
        in_use_database_name = api_info['info']['databaseName']
        # Go through each database that starts with the right prefix.
        # Ignore the one that's in use, and any less than three days old.
        prefix = '{0}_{1}_'.format(popit_site, popit_instance)
        matcher = re.compile(
            '^' + prefix + r'(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$'
        )
        today = date.today()
        for database_name in mongo_databases:
            if not database_name.startswith(prefix):
                continue
            if database_name == in_use_database_name:
                print("Ignoring in-use database", database_name)
                continue
            m_timestamp = matcher.search(database_name)
            if not m_timestamp:
                msg = "Ignoring name with no a timestamp: {0}"
                print(msg.format(database_name))
                continue
            date_parts = [int(p, 10) for p in m_timestamp.groups()]
            database_date = date(*date_parts[:3])
            if database_date > (today - timedelta(days=3)):
                print("Ignoring too recent database:", database_name)
                continue
            # Now we have a database that it should be safe to remove:
            remove_database(database_name)
