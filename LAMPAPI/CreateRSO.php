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
        // Check if the user has Admin privileges
        $stmt = $conn->prepare("SELECT Privileges FROM Users WHERE Username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // If user has Admin privileges, proceed with RSO creation
        if ($result->num_rows > 0 && $result->fetch_assoc()["Privileges"] === "Admin") {
            $stmt = $conn->prepare("INSERT INTO RSO (RSO_Name, Description) VALUES (?, ?)");
            $stmt->bind_param("ss", $RSOName, $description);

            if ($stmt->execute()) {
                // Get the ID of the last inserted row
                $last_id = $conn->insert_id;
                // Return the ID as JSON response
                sendResultInfoAsJson(json_encode(["message" => "New RSO was created", "id" => $last_id]));
            } else {
                returnWithError($conn->error);
            }
        } else {
            returnWithError("User does not have sufficient privileges to create an RSO.");
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
