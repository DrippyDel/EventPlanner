# EventPlanner
Event Planner
End Points:

List of all endpoints

User

Create User:
⦁	Registration Endpoint
⦁	Endpoint: POST http://104.131.71.40/LAMPAPI/CreateUser.php
⦁	Description: Registers a new user.
⦁	Request Payload:
⦁	JSON object with the following fields:
⦁	{
⦁	  "Username": "",
⦁	  "Password": "",
⦁	  "Email": "",
⦁	  "FirstName": "",
⦁	  "LastName": ""
⦁	  "Privileges": " "
⦁	}
⦁	Example:
⦁	{
⦁	  "Username": "Drippy",
⦁	  "Password": "test",
⦁	  "Email": "drippy@example.com",
⦁	  "FirstName": "Delali",
⦁	  "LastName": "Ekpeh"
⦁	  "Privileges": " "
⦁	}
⦁	Response:
⦁	Success (Status Code: 200):
⦁	"New Record Created"
⦁	Error (Status Code: 400):
⦁	JSON object with an error field describing the encountered error(s).
           **Note RSO_ID is auto populated to 0 when User is created. 
               If Privileges are " " (Empty String) good to assume that they are a 	regular user.

Login:
⦁	Endpoint: POST http://104.131.71.40/LAMPAPI/Login.php
⦁	Description: Logs in an existing user.
⦁	Request Payload:
⦁	JSON object with the following fields:
⦁	{
⦁	    "Username": "",
⦁	  "Password": ""
⦁	}
⦁	Example:
⦁	{
⦁	    "Username": "Ricky",
⦁	  "Password": "test"
⦁	}
⦁	Response:
⦁	Success (Status Code: 200):
⦁	{
⦁	    "UID": ,
⦁	    "FirstName": "",
⦁	    "LastName": "",
⦁	    "Username": "",
⦁	   "Privileges": "",
⦁	   "RSO_ID": ,
⦁	    "error": ""
⦁	}
⦁	Example:
⦁	{
⦁	    "UID": ,
⦁	    "FirstName": "Ricky",
⦁	    "LastName": "L",
⦁	    "Username": "Ricky",
⦁	   "Privileges": "Admin",
⦁	    "RSO_ID": 0,
⦁	    "error": ""
⦁	}
⦁	Error (Status Code: 400 or 404 or 401):
⦁	JSON object with an error field describing the encountered error(s).

Events
Create Event:
⦁	Registration Endpoint
⦁	Endpoint: POST http://104.131.71.40/LAMPAPI/CreateEvent.php
⦁	Description: Registers a new Event
⦁	Request Payload:
⦁	JSON object with the following fields:
⦁	{
⦁	 "username": "",
⦁	    "location": "",
⦁	    "eventName": "",
⦁	    "description": "",
⦁	    "eventType": "",
⦁	    "eventDay": "",
⦁	    "eventTime": "",
⦁	    "superAdminID": ,
⦁	    "locationAddress": ""
⦁	}
⦁	Example:
⦁	{
⦁	    "username": "Ricky",
⦁	    "location": "Example Location",
⦁	    "eventName": "Example Event",
⦁	    "description": "This is a test event",
⦁	    "eventType": "Public",
⦁	    "eventDay": "2024-04-15",
⦁	    "eventTime": "18:00:00",
⦁	    "superAdminID": 9,
⦁	    "locationAddress": "123 Example St, City, State, ZIP"
⦁	}
⦁	Response:
⦁	Success (Status Code: 200):
⦁	"New Event Record was created",
⦁	"id": 2
⦁	Error (Privilages is not Admin):
⦁	"User does not have sufficient privileges to create an event."
⦁	Error (Wrong SuperAdmin Id):
⦁	"error": "Incorrect SuperAdmin ID."
⦁	Error (Status Code: 400):
⦁	JSON object with an error field describing the encountered error(s).
           **Note As long as you pass in the Username of the user that is logged 	in the api would check the privilages for you.

			
Events

Create RSO:
⦁	Registration Endpoint
⦁	Endpoint: POST http://104.131.71.40/LAMPAPI/CreateRSO.php
⦁	Description: Registers a new RSO.
⦁	Request Payload:
⦁	JSON object with the following fields:
⦁	{
⦁	    "username": "",
⦁	    "RSOName": "",
⦁	    "description": ""
⦁	}
⦁	Example:
⦁	{
⦁	    "username": "Ricky",
⦁	    "RSOName": "Tech Club",
⦁	    "description": "A club for technology enthusiasts."
⦁	}
⦁	Response:
⦁	Success (Status Code: 200):
⦁	"New RSO was created",
⦁	"id" : 1
⦁	Error (Privilages is not Admin):
⦁	"User does not have sufficient privileges to create an RSO."
⦁	Error (Status Code: 400):
⦁	JSON object with an error field describing the encountered error(s).
           **Note As long as you pass in the Username of the user that is logged 	in the api would check the privilages for you.

Comment

Create Comment:
⦁	Registration Endpoint
⦁	Endpoint: POST http://104.131.71.40/LAMPAPI/CreateComment.php
⦁	Description: Registers a new Comment.
⦁	Request Payload:
⦁	JSON object with the following fields:
⦁	{
⦁	    "username": "",
⦁	    "text": "",
⦁	    "rating": ,
⦁	    "eventsID": 
⦁	}
⦁	Example:
⦁	{
⦁	    "username": "Drippy",
⦁	    "text": "This event was great!",
⦁	    "rating": 5,
⦁	    "eventsID": 1
⦁	}
⦁	Response:
⦁	Success (Status Code: 200):
⦁	"New Comment Record was created",
⦁	"id" : 1
⦁	Error (Status Code: 400):
⦁	JSON object with an error field describing the encountered error(s).
       
