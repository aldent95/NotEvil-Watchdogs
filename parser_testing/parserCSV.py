import argparse
import os
import sys
import json
import csv
import requests
from requests.exceptions import ConnectionError
from datetime import datetime

fmt = '%d-%m-%Y %H:%M:%S'

def is_valid_file(parser, arg):
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return arg

argparse = argparse.ArgumentParser(description="Load XML file into program")
argparse.add_argument('-i', dest='filename',required=True,help='Input xml log file',metavar='FILE', type=lambda x: is_valid_file(argparse,x))
args=argparse.parse_args()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
fieldnames = []
rows = []
i = 0
with open(args.filename,'r') as infile:
    for line in infile:
        if i == 0:
            row = line.split(';')
            for field in row:
                fieldnames.append(field.strip("(aff)").replace(' ', '_').strip('\n'))
            i = i+1
        else:
            rows.append(line)
fieldnames = tuple(fieldnames)
csvfile = csv.DictReader(rows, fieldnames, delimiter=';')
print ('Done')

url = 'http://150.242.41.175:5050/rabo/Interaction_Activity/'
headers = {'Content-Type': 'application/json'}
for row in csvfile:
    date = datetime.strptime(row['DateStamp'], fmt)
    row['DateStamp'] = str(date)
    try:
        response = requests.post(url, headers=headers, data=json.dumps(row))
        if response.status_code != 201:
            print response.json()
    except ConnectionError as e:
        print e





