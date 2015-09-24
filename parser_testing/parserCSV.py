import argparse
import os
import sys
import json
import csv
import requests
import string
import re
import databasePopulator as dbpop
import pprint

from requests.exceptions import ConnectionError
from datetime import datetime
from rabo_data.models import Incident_Activity


#checks the validity of File
def is_valid_file(parser, arg):
    # Returns true Boolean value if file path is wrong or invalid file
    #  sends user error message else returns the file
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return arg

def parseFile(fileObject, filename):
    # 
    datere = re.compile('^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$')
    #Date Time Regular Expression format 1, Day:Month:Year ; Hours:Minutes, 
    #format 2, Day:Month:Year ; Hours:Minutes:Seconds
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

    """ 
    This reads in each row of the parsed data and groups them by
    the Incident ID
    """
    groupedData = {}
    for row in csvfile:
        try: 
            #probably need to amend something in here but i can't think today my brain is broken
            groupedData[row["Incident ID"]].append(row)


        except KeyError: 
            groupedData[row["Incident ID"]] = [row,]


    for key, rows in groupedData.iteritems():

        metaData = {"Incident ID": key} #leaving Empty right now, for later use
        events = [] #Events metadata for sorting

        for row in rows:
            eventMetaData{"DateStamp": row["DateStamp"], "ActNum": row["IncidentActivity_Number"], 
                "ActType": row["IncidentActivity_Type"], "AssignGroup": row["Assignment Group"], "KMNum": row["KM number"], "InteractionID": row["Interaction ID"]}                       
            eventObj = {"Name" : eventMetaData["ActType"], "DateStamp" : eventMetaData["DateStamp"], "metadata" : eventMetaData } #contains each event sorted for dict
            events.append(eventObj)


        data = {"Events" : events, "MetaData" : metaData}
        pp = pprint.PrettyPrinter(indent=4)
        pp.pprint(data)


 


