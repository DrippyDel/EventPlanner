<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $commentID = $inData["commentID"];

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
            // Check if the comment exists
            $stmt = $conn->prepare("SELECT Comment_ID FROM Comments WHERE Comment_ID = ?");
            $stmt->bind_param("i", $commentID);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Delete comment from Comments table
                $stmt = $conn->prepare("DELETE FROM Comments WHERE Comment_ID = ?");
                $stmt->bind_param("i", $commentID);

                if ($stmt->execute()) {
                    sendResultInfoAsJson(json_encode(["message" => "Comment with ID $commentID was deleted"]));
                } else {
                    returnWithError($conn->error);
                }
            } else {
                returnWithError("Comment with ID $commentID does not exist.");
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
