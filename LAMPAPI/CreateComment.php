<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $text = $inData["text"];
    $rating = $inData["rating"];
    $eventsID = $inData["eventsID"];

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
            // Check if the event exists
            $stmt = $conn->prepare("SELECT Events_ID FROM Events WHERE Events_ID = ?");
            $stmt->bind_param("i", $eventsID);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Insert comment into Comments table
                $stmt = $conn->prepare("INSERT INTO Comments (Text, Rating, Username, Events_ID) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("sisi", $text, $rating, $username, $eventsID);

                if ($stmt->execute()) {
                    $last_id = $conn->insert_id;
                    sendResultInfoAsJson(json_encode(["message" => "New Comment Record was created", "id" => $last_id]));
                } else {
                    returnWithError($conn->error);
                }
            } else {
                returnWithError("Event with ID $eventsID does not exist.");
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
