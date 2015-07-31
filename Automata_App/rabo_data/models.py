from django.db import models


class Interaction_Activity(models.Model):
	""""""
	IncidentActivity_Number = models.CharField(max_length=100, primary_key=True)
	IncidentActivity_Type = models.CharField(max_length=100)
	Assignment_Group = models.CharField(max_length=100)
	KM_number = models.CharField(max_length=100)
	Interaction_ID = models.CharField(max_length=100)
	Incident_ID= models.CharField(max_length=100)
	DateStamp = models.DateTimeField()