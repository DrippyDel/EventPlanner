<?php
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $Login = $inData["Login"];
    $Password = $inData["Password"];

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");
        
        // Check if the statement was prepared successfully
        if ($stmt === false) {
            returnWithError("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("ssss", $firstName, $lastName, $Login, $Password);
        
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
        return json_decode(file_get_contents('php://input'), true);
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
