README
--------------------------------------
The log files contain data about building permit applications in five Dutch municipalities over approximately four years. 

There are five different log files available. Events are labeled with both a code and a Dutch and English label. Each activity code consists of three parts: two digits, a variable number of characters, and then three digits. The first two digits as well as the characters indicate the subprocess the activity belongs to. For instance ‘01_HOOFD_xxx’ indicates the main process and ‘01_BB_xxx’ indicates the ‘objections and complaints’ (‘Beroep en Bezwaar’ in Dutch) subprocess. The last three digits hint on the order in which activities are executed, where the first digit often indicates a phase within a process.

The headers of each log file contain meta data. (Elaborate)?

Each trace element is presumably one building permit application. 

The trace element has many attributes, some notable attributes are as follows: 
1) startDate 
2) endDate
3) endDatePlanned
4) Responsible_actor (assumed to be the person issuing the permit?)
5) multiple events (the different events in the building permit application)

The event elements contained inside the trace element seem to be the series of steps that have been taken for each building permit application.

The notable attributes for events are as follow:
1) actvityNameEN (the name of the activity/event)
2) dueDate 
3) planned (the time that the event was planned to be completed by?)
4) action_code (also referenced to as activity code)
5) time (the time that the activity was completed?)



Log files
--------------------------------------
Log 1: 1199 cases, 52217 events, 398 event classes, 10.4121/uuid:a0addfda-2044-4541-a450-fdcc9fe16d17. Please use this DOI in any reference to the dataset.
Log 2: 832 cases, 44354 events, 410 event classes, 10.4121/uuid:63a8435a-077d-4ece-97cd-2c76d394d99c. Please use this DOI in any reference to the dataset.
Log 3: 1409 cases, 59681 events, 383 event classes, 10.4121/uuid:ed445cdd-27d5-4d77-a1f7-59fe7360cfbe. Please use this DOI in any reference to the dataset.
Log 4: 1053 cases, 47293 events, 356 event classes, 10.4121/uuid:679b11cf-47cd-459e-a6de-9ca614e25985. Please use this DOI in any reference to the dataset.
Log 5: 1156 cases, 59083 events, 398 event classes, 10.4121/uuid:b32c6fe5-f212-4286-9774-58dd53511cf8. Please use this DOI in any reference to the dataset.