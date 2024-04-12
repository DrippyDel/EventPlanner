<?php
    $inData = getRequestInfo();
    
    $UID = 0;
    $firstName = "";
    $lastName = "";
    $Privileges = "";

    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");    
    if ($conn->connect_error) {
        error_log("Database connection error: " . $conn->connect_error);
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("SELECT UID, FirstName, LastName, Privileges FROM Users WHERE Username=? AND Password=?");

        if ($stmt === false) {
            error_log("Prepare statement error: " . $conn->error);
            returnWithError("Prepare statement error: " . $conn->error);
        }
        
        $stmt->bind_param("ss", $inData["Username"], $inData["Password"]);

        if ($stmt->execute()) {
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                returnWithInfo($row['FirstName'], $row['LastName'], $row['UID'], $row['Privileges']);
            } else {
                returnWithError("No Records Found");
            }
        } else {
            error_log("Execute statement error: " . $stmt->error);
            returnWithError("Execute statement error: " . $stmt->error);
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
        $retValue = '{"UID":0,"FirstName":"","LastName":"","Privileges":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($firstName, $lastName, $UID, $Privileges)
    {
        $retValue = '{"UID":' . $UID . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '", "Privileges": "' . $Privileges . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
