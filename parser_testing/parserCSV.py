import argparse
import os
import sys
import json
import csv
import requests
import string
from requests.exceptions import ConnectionError
from datetime import datetime
import re
import databasePopulator as dbpop
from rabo_data.models import Incident_Activity
def is_valid_file(parser, arg):
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return arg
def parseFile(fileObject, filename):
    datere = re.compile('^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$')
    fmt1 = '%d-%m-%Y %H:%M'
    fmt2 = '%d-%m-%Y %H:%M:%S'
    fieldnames = []
    rows = []
    i = 0
    print fileObject
    data = fileObject.read()
    data = data.split('\n')
    print filename
    print 'reading'    
    for line in data:
	print line
        line.strip('\r')
        if i == 0:
            
            row = line.split(';')
	    print row
            return
            for field in row:
                if field.startswith('#'):
                    field.strip('#')
                    field = "Number " + field
                fieldnames.append(field.strip("(aff)").replace(' ', '_').strip('\n'))
            i = i+1
        else:
            rows.append(line)
    
    fieldnames = tuple(fieldnames)
    csvfile = csv.DictReader(rows, fieldnames, delimiter=';')
    print ('Done')
    for row in csvfile:
        for key in row:
            if datere.match(row[key].split(' ')[0]):
                date = 0
                try:
                    date = datetime.strptime(row[key], fmt1)
                except ValueError:
                    date= datetime.strptime(row[key], fmt2)
                row[key] = str(date)
        dbpop.populate(row, filename)
    print 'fully finished loading'




