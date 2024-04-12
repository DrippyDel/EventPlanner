<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $RSOName = $inData["RSOName"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Get RSO details
        $stmt = $conn->prepare("SELECT RSO_ID FROM RSO WHERE RSO_Name = ?");
        $stmt->bind_param("s", $RSOName);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $RSO_ID = $row["RSO_ID"];

            // Update user's RSO_ID to join the RSO
            $stmt = $conn->prepare("UPDATE Users SET RSO_ID = ? WHERE Username = ?");
            $stmt->bind_param("is", $RSO_ID, $username);
            $stmt->execute();

            // Return success message
            sendResultInfoAsJson(json_encode(["message" => "Joined RSO successfully"]));
        } else {
            returnWithError("RSO not found.");
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
