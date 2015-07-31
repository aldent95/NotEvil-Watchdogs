import argparse
import os
import sys
import json
import csv

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
                fieldnames.append(field.strip("(aff)"))
            i = i+1
        else:
            rows.append(line)
fieldnames = tuple(fieldnames)
csvfile = csv.DictReader(rows, fieldnames, delimiter=';')
jsonfile = open('output.json','w')
print ('Done')
for row in csvfile:
    json.dump(row, jsonfile)
    jsonfile.write('\n')

