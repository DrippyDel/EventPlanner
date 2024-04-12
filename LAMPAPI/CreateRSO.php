<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $RSOName = $inData["RSOName"];
    $description = $inData["description"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Proceed with RSO creation
        $stmt = $conn->prepare("INSERT INTO RSO (RSO_Name, Description) VALUES (?, ?)");
        $stmt->bind_param("ss", $RSOName, $description);

        if ($stmt->execute()) {
            // Get the ID of the last inserted row
            $last_id = $conn->insert_id;

            // Update user's privileges to Admin
            $stmt = $conn->prepare("UPDATE Users SET Privileges = 'Admin', RSO_ID = ? WHERE Username = ?");
            $stmt->bind_param("is", $last_id, $username);
            $stmt->execute();

            // Return the ID as JSON response
            sendResultInfoAsJson(json_encode(["message" => "New RSO was created", "id" => $last_id]));
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
