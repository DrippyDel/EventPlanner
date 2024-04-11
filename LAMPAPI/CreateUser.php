<?php
    $inData = getRequestInfo();
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Username = $inData["Username"];
    $Password = $inData["Password"];
    $Email = $inData["Email"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO Users (Username, Password, Email, FirstName, LastName) VALUES (?, ?, ?, ?, ?)");
        
        // Check if the statement was prepared successfully
        if ($stmt === false) {
            returnWithError("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("sssss", $Username, $Password, $Email, $FirstName, $LastName);
        
        // Execute the prepared statement
        if ($stmt->execute())
        {
            echo json_encode(["message" => "New Record was created"]);
        }
        else
        {
            returnWithError("Execute failed: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();
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
