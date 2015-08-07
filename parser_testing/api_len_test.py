import argparse
import os
import sys
import json
import csv
import requests
from requests.exceptions import ConnectionError
from datetime import datetime

url = 'http://150.242.41.175:5050/rabo/Interaction_Activity/'
headers = {'Content-Type': 'application/json'}
try:
    response = requests.get(url, headers=headers)
    print len(response.json())
except ConnectionError as e:
    print e
