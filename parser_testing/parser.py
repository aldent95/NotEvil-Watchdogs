import xml.etree.ElementTree as ET
import os
import sys


os.chdir(os.path.dirname(__file__)+"\data")
ET.register_namespace("","http://www.xes-standard.org/")
tree = ET.parse('BPIC15_1.xes.xml')
print ('Done')
root = tree.getroot()
print root.tag
print root.attrib
tree.write('output.xml')
print('Output done')
