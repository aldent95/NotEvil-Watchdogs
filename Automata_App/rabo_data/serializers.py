from rest_framework import serializers
from rabo_data.models import Incident_Activity


class Incident_ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident_Activity
        fields = (
        	"IncidentActivity_Number",
			"IncidentActivity_Type",
			"Assignment_Group",
			"KM_number",
			"Interaction_ID",
			"Incident_ID",
			"DateStamp"
		)
