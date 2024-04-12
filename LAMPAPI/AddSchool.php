<?php
    $inData = getRequestInfo();
    $schoolName = $inData["schoolName"];
    $address = $inData["address"];
    $longitude = $inData["longitude"];
    $latitude = $inData["latitude"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // Insert school location into Locations table
        $stmt = $conn->prepare("INSERT INTO Locations (Lname, Address, Longitude, Latitude) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssdd", $schoolName, $address, $longitude, $latitude);

        if ($stmt->execute()) {
            // Get the ID of the last inserted row
            $last_id = $conn->insert_id;
            // Return the ID as JSON response
            sendResultInfoAsJson(json_encode(["message" => "New School Location was created", "id" => $last_id]));
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
