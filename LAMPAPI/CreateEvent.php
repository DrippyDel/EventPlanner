<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $location = $inData["location"];
    $eventName = $inData["eventName"];
    $description = $inData["description"];
    $eventType = $inData["eventType"];

    // Create database connection
     $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // Check if the user has Admin privileges
        $stmt = $conn->prepare("SELECT Privileges FROM Users WHERE Username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // If user has Admin privileges, proceed with event creation
        if ($result->num_rows > 0 && $result->fetch_assoc()["Privileges"] === "Admin") {
            $stmt = $conn->prepare("INSERT INTO Events (Location, Event_name, Description, EventType) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $location, $eventName, $description, $eventType);

            if ($stmt->execute()) {
                // Get the ID of the last inserted row
                $last_id = $conn->insert_id;
                // Return the ID as JSON response
                sendResultInfoAsJson(json_encode(["message" => "New Event Record was created", "id" => $last_id]));
            } else {
                returnWithError($conn->error);
            }
        } else {
            returnWithError("User does not have sufficient privileges to create an event.");
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
