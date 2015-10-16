# Documentation for Business Process Modeller  -  Swen 302 Project

## Designed by !Evil Watchdogs


### 1.	Django Framework

The Django Framework is the base of the Project so to run it there are several commands you should know to use this program

[Main Django page](https://www.djangoproject.com/)

We used the Django Framework and the Django Rest Framework for this project as it is a safe and secure framework which is recognised and used in commericial projects.




### 2.	Format style

The “program” takes data in a Json file format.

Format Required for JSON Data


```
{
   "uuid":1,
   "events":[
      {
         "name":"start",
         "date_stamp":"2015-05-12T00:00:00",
         "metadata":{         }
      },
      {
         "name":"middle",
         "date_stamp":"2015-05-12T00:01:00",
         "metadata":{         }
      },
      {
         "name":"end",
         "date_stamp":"2015-05-12T00:02:00",
         "metadata":{         }
      }
   ],
   "metadata":{   }
}
```

---------------------------------------------------------------------

```
{
"uuid":number, 
"events":[
	{
		"name":(event Name), 
		"data_stamp": (event date stamp, see note),
		"metadata":{(can be empty)}
	}, 
	(can have more events after the first)
],

	"metadata":{(can be empty)}
}

uuid is Universal Unique Identifier
```


As long as you fit this Json format with a simple parser the “program” can take that data.
This “Program” contains a basic csv parser that is tuned to A Rabobank Data set which is also included and can be used as an example of what is required.



### 3. Web Application

#### Sign Up

Required Fields in Sign up are Username, Email, Password and Verification, First and Last Name.

Company Name is an optional Field.


#### Log In

Username and password to login

Lost password link to Django admin page, enter email address for password reset.


#### Projects Page

The Projects page initially only has two buttons which are New project Button and logout link.

After you have made a new project you can then Add a log to the project or go to the project's visulaisation page and well as the previous options.

#### Visualisation Page

The Visualisation Page has the automata in the main drawing panel assuming you have added a log into the project and the sidebar on the right displays data on a node when selected.

Green Node is the open node and the red Nodes are the closed Nodes.
When Nodes are selected they have a pink border to signify being selected.

There is a scroll zooming in and out fuctionality but at the stage that this document was written on certain systems and/or Internet Browsers can only scroll in and out when hovering over a node.

There is also moving functionality to move the diagram within the drawing panel but has the same bug as above where you have to click and drag a node can't just be anywhere.

- Flat sizing 

	Flat Sizing means all of the nodes are the same size.

- Square sizing

	Square Sizing is the Volume of the Nodes is proprotional to the count.

- Cubic Sizing

	Cubic Sizing is the Volume of the Node modelled as a sphere is proportional to the count.

- Hide Children

	If this is still included it was for testing purposes.

- Min Frequency slider and Update Button

	If the Count of the node is less than the Minimum Frequency then that node is removed from the visualisation.
	This resets to flat sizing

### 4. D3 Javascript Front End Production

The frontend is comprised mostly of D3 Javascript, Javascript and base indexs plus styling elements of HTML and CSS.

The following link is the D3 Docs:
[D3 Documentation](https://github.com/mbostock/d3/wiki)

The visualization is using a forced layout from D3 library

[D3 Forced Layout](https://github.com/mbostock/d3/wiki/Force-Layout)


#### 5. Deployment and Dev Environment

Step by step run through here:

We have assumed that Git, Pip, Python dev, and libpq-dev is already installed as the a standard requirment.

	+ Clone Repository
```
git clone NotEvil-Watchdogs
```

In the Automata_App folder do the following commands

```
sudo pip install -r requirements.txt

python manage.py makemigrations (This command should be already completed on delivery)


python manage.py runserver 0.0.0.0:80

```

Then when the server is running on either local machine or on a virtual machine need to make user or logon to existing account.



#### 6. Known Bugs/Issues

* Can't Toggle nodes on or off of open or closed tags

* Dragging and zooming on nodes works differently on different operating systems

*

