<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $location = $inData["location"];
    $eventName = $inData["eventName"];
    $description = $inData["description"];
    $eventType = $inData["eventType"];
    $eventDay = $inData["eventDay"];
    $eventTime = $inData["eventTime"];
    $superAdminID = $inData["superAdminID"];
    $locationAddress = $inData["locationAddress"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // Check if the user is an Admin
        $stmt = $conn->prepare("SELECT UID, Privileges FROM Users WHERE Username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userID = $row["UID"];
            $userPrivileges = $row["Privileges"];

            // Check if the user is an Admin
            if ($userPrivileges === "Admin") {
                // Check if the SuperAdmin ID is correct
                $stmt = $conn->prepare("SELECT UID FROM Users WHERE UID = ? AND Privileges = 'SuperAdmin'");
                $stmt->bind_param("i", $superAdminID);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    // SuperAdmin ID is correct, proceed with event creation
                    $stmt = $conn->prepare("INSERT INTO Events (Location, Location_Address, Event_name, Description, EventType, Event_Day, Event_Time) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("sssssss", $location, $locationAddress, $eventName, $description, $eventType, $eventDay, $eventTime);

                    if ($stmt->execute()) {
                        // Get the ID of the last inserted row
                        $last_id = $conn->insert_id;
                        
                        // Insert event into appropriate table based on event type
                        switch ($eventType) {
                            case "RSO":
                                $stmt = $conn->prepare("INSERT INTO RSO_Events (RSO_ID, Events_ID) VALUES (?, ?)");
                                break;
                            case "Public":
                                $stmt = $conn->prepare("INSERT INTO Public_Events (SuperAdmin_ID, Event_Name, Description, Time, Location) VALUES (?, ?, ?, ?, ?)");
                                break;
                            case "Private":
                                $stmt = $conn->prepare("INSERT INTO Private_Events (Admin_ID, Event_Name, Description, Time, Location) VALUES (?, ?, ?, ?, ?)");
                                break;
                            default:
                                // If the event type is none of the above, insert into Events table
                                $stmt = $conn->prepare("INSERT INTO Events (Location, Location_Address, Event_name, Description, EventType, Event_Day, Event_Time) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        }
                        
                        // Bind parameters and execute the statement
                        if (isset($stmt)) {
                            if ($eventType === "RSO") {
                                $stmt->bind_param("ii", $userID, $last_id);
                            } else if ($eventType === "Public" || $eventType === "Private") {
                                $stmt->bind_param("issss", $userID, $eventName, $description, $eventTime, $location);
                            } else {
                                $stmt->bind_param("sssssss", $location, $locationAddress, $eventName, $description, $eventType, $eventDay, $eventTime);
                            }
                            $stmt->execute();
                        }
                        
                        // Return the ID as JSON response
                        sendResultInfoAsJson(json_encode(["message" => "New Event Record was created", "id" => $last_id]));
                    } else {
                        returnWithError($conn->error);
                    }
                } else {
                    returnWithError("Incorrect SuperAdmin ID.");
                }
            } else {
                returnWithError("User does not have sufficient privileges to create an event.");
            }
        } else {
            returnWithError("User not found.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
