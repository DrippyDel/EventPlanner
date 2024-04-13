<?php
    $inData = getRequestInfo();
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Username = $inData["Username"];
    $Password = $inData["Password"];
    $Email = $inData["Email"];
    $Privileges = $inData["Privileges"];
    $University = $inData["University"]; // Added University field
    $RSO_ID = 0; // Hardcoded RSO_ID to zero

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO Users (Username, Password, Email, FirstName, LastName, University, Privileges, RSO_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        // Check if the statement was prepared successfully
        if ($stmt === false) {
            returnWithError("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("sssssssi", $Username, $Password, $Email, $FirstName, $LastName, $University, $Privileges, $RSO_ID); // Added RSO_ID field
        
        // Execute the prepared statement
        if ($stmt->execute())
        {
            // Fetch the newly created user's data
            $newUserID = $stmt->insert_id;
            $newUser = getUserInfo($conn, $newUserID);
            
            // Construct response JSON object with user data and message
            $response = [
                "message" => "New Record was created",
                "user" => $newUser
            ];
            
            // Send response as JSON
            sendResultInfoAsJson(json_encode($response));
        }
        else
        {
            returnWithError("Execute failed: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();
    }

    function getUserInfo($conn, $userID)
    {
        // Fetch user's information based on user ID
        $stmt = $conn->prepare("SELECT * FROM Users WHERE UID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Fetch the first (and only) row from the result set
        $user = $result->fetch_assoc();
        
        // Close statement
        $stmt->close();
        
        return $user;
    }

    function getRequestInfo()
    {
        $json = file_get_contents('php://input');
        if ($json === false) {
            returnWithError("Failed to retrieve JSON data from request.");
        }

        $data = json_decode($json, true);
        if ($data === null) {
            returnWithError("Failed to parse JSON data.");
        }

        return $data;
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
