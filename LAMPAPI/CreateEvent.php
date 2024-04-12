<?php
    $inData = getRequestInfo();
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
