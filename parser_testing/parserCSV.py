import argparse
import os
import sys
import json
import csv
import requests
import string
import re
import pprint

from requests.exceptions import ConnectionError
from datetime import datetime


#checks the validity of File
def is_valid_file(parser, filename):
    # Returns true Boolean value if file path is wrong or invalid file
    #  sends user error message else returns the file
    if not os.path.exists(filename):
        parser.error("The file %s does not exist!" % filename)
    else:
        return filename

def parseFile(args):
    # 
    datere = re.compile('^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$')
    #Date Time Regular Expression format 1, Day:Month:Year ; Hours:Minutes, 
    #format 2, Day:Month:Year ; Hours:Minutes:Seconds
    fmt1 = '%d-%m-%Y %H:%M'
    fmt2 = '%d-%m-%Y %H:%M:%S'
    fieldnames = []
    rows = []
    i = 0
    filename = args.file
    fileObject = open(filename)
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

    """ 
    This reads in each row of the parsed data and groups them by
    the Incident ID
    """
    groupedData = {}
    for row in csvfile:
        try: 
            #probably need to amend something in here but i can't think today my brain is broken
            groupedData[row["Incident_ID"]].append(row)


        except KeyError: 
            groupedData[row["Incident_ID"]] = [row,]

    print "\nNumber of logs:"
    print len(groupedData.keys())
    print

    for key, rows in groupedData.iteritems():

        metaData = {"Incident_ID": key} #leaving Empty right now, for later use
        events = [] #Events metadata for sorting

        for row in rows:
            try:
                date = datetime.strptime(row["DateStamp"], fmt1)
            except ValueError:
                date = datetime.strptime(row["DateStamp"], fmt2)

            row["DateStamp"] = str(date)
            eventMetaData = {"DateStamp": row["DateStamp"], "ActNum": row["IncidentActivity_Number"], 
                "ActType": row["IncidentActivity_Type"], "AssignGroup": row["Assignment_Group"], "KMNum": row["KM_number"], "InteractionID": row["Interaction_ID"]}                       
            eventObj = {"name" : eventMetaData["ActType"], "date_stamp" : eventMetaData["DateStamp"], "metadata" : eventMetaData } #contains each event sorted for dict
            events.append(eventObj)


        data = {"uuid": key, "events" : events, "metadata" : metaData}

        url = args.url + "automata/projects/" + args.p_uuid + "/logs"

        headers = {"content-type": "application/json"}

        r = requests.post(url, data=json.dumps(data), headers=headers)
        print(r.json())





 


def run():
    a = argparse.ArgumentParser("Rabo Data Event Parser")

    a.add_argument("-f", "--file", dest="file", help="Path to event file",
                   required=True)
    a.add_argument("-u", "--url", dest="url", help="server url", required=True)
    a.add_argument("-p", "--project", dest="p_uuid", required=True)

    args = a.parse_args()

    is_valid_file(a, args.file)
    parseFile(args)
    



if __name__ == "__main__":
    run()

