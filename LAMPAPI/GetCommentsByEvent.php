<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $eventID = $inData["eventID"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Check if the user exists
        $stmt = $conn->prepare("SELECT Username FROM Users WHERE Username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Fetch all comments for the given eventID
            $stmt = $conn->prepare("SELECT * FROM Comments WHERE Events_ID = ?");
            $stmt->bind_param("i", $eventID);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $comments = array();
                while ($row = $result->fetch_assoc()) {
                    $comments[] = $row;
                }
                sendResultInfoAsJson(json_encode($comments));
            } else {
                returnWithError("No comments found for event with ID $eventID.");
            }
        } else {
            returnWithError("User with username $username does not exist.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
