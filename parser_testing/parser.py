import xml.etree.ElementTree as ET
import argparse
import os
import sys


def is_valid_file(parser, arg):
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return arg

argparse = argparse.ArgumentParser(description="Load XML file into program")
argparse.add_argument('-i', dest='filename',required=True,help='Input xml log file',metavar='FILE', type=lambda x: is_valid_file(argparse,x))
args=argparse.parse_args()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
ET.register_namespace("","http://www.xes-standard.org/")
tree = ET.parse(args.filename)
print ('Done')
root = tree.getroot()
print root.tag
print root.attrib
tree.write('output.xml')
print('Output done')
