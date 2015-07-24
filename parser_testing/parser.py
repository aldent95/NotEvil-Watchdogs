import xml.etree.ElementTree as ET
import argparse
import os
import sys
from collections import defaultdict
from pprint import pprint
import json

def is_valid_file(parser, arg):
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return arg
def etree_to_dict(t):
    d = {t.tag: {} if t.attrib else None}
    children = list(t)
    if children:
        dd = defaultdict(list)
        for dc in map(etree_to_dict, children):
            for k, v in dc.iteritems():
                dd[k].append(v)
        d = {t.tag: {k:v[0] if len(v) == 1 else v for k, v in dd.iteritems()}}
    if t.attrib:
        d[t.tag].update(('@' + k, v) for k, v in t.attrib.iteritems())
    if t.text:
        text = t.text.strip()
        if children or t.attrib:
            if text:
                d[t.tag]['#text'] = text
        else:
            d[t.tag]=text
    return d
argparse = argparse.ArgumentParser(description="Load XML file into program")
argparse.add_argument('-i', dest='filename',required=True,help='Input xml log file',metavar='FILE', type=lambda x: is_valid_file(argparse,x))
args=argparse.parse_args()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
ET.register_namespace("","http://www.xes-standard.org/")
tree = ET.parse(args.filename)
print ('Done')
root = tree.getroot()
xmlDict = etree_to_dict(root)
with open("output.txt",'w') as outfile:
    json.dump(xmlDict, outfile, indent=1)

