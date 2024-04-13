<?php
    $inData = getRequestInfo();
    $username = $inData["username"];
    $searchQuery = isset($inData["search"]) ? $inData["search"] : "";

    // Create database connection
    $conn = new mysqli("localhost", "Admin", "password", "EventPlannerDB");

    // Check connection
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Check if the user exists
        $stmt = $conn->prepare("SELECT UID, Privileges, RSO_ID FROM Users WHERE Username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userID = $row["UID"];
            $userPrivileges = $row["Privileges"];
            $userRSO_ID = $row["RSO_ID"];

            // Fetch events based on user's privileges
            switch ($userPrivileges) {
                case "SuperAdmin":
                case "Admin":
                    $events = getAllEvents($conn, $searchQuery);
                    break;
                case "Student":
                    $events = getUserEvents($conn, $userID, $userRSO_ID, $searchQuery);
                    break;
                default:
                    returnWithError("User does not have sufficient privileges.");
            }

            // Return events as JSON response
            sendResultInfoAsJson(json_encode($events));
        } else {
            returnWithError("User not found.");
        }

        $stmt->close();
        $conn->close();
    }

    function getAllEvents($conn, $searchQuery) {
        $events = array();

        // Fetch all events from Events table matching search query
        $stmt = $conn->prepare("SELECT * FROM Events WHERE Event_name LIKE ?");
        $searchQuery = "%" . $searchQuery . "%";
        $stmt->bind_param("s", $searchQuery);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }

        return $events;
    }

    function getUserEvents($conn, $userID, $userRSO_ID, $searchQuery) {
        $events = array();

        // Fetch RSO events with the same RSO_ID as the user matching search query
        $stmt = $conn->prepare("SELECT * FROM RSO_Events WHERE RSO_ID = ? AND Event_name LIKE ?");
        $userRSO_ID = intval($userRSO_ID);
        $searchQuery = "%" . $searchQuery . "%";
        $stmt->bind_param("is", $userRSO_ID, $searchQuery);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            // Fetch corresponding event details from Events table
            $eventID = $row["Events_ID"];
            $eventDetails = getEventDetails($conn, $eventID);
            $events[] = $eventDetails;
        }

        // Fetch public events with the same location as the user's university matching search query
        $userUniversity = getUserUniversity($conn, $userID);
        $stmt = $conn->prepare("SELECT * FROM Events WHERE EventType = 'Public' AND Location = ? AND Event_name LIKE ?");
        $searchQuery = "%" . $searchQuery . "%";
        $stmt->bind_param("ss", $userUniversity, $searchQuery);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }

        return $events;
    }

    function getEventDetails($conn, $eventID) {
        // Fetch event details based on event ID
        $stmt = $conn->prepare("SELECT * FROM Events WHERE Events_ID = ?");
        $stmt->bind_param("i", $eventID);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    function getUserUniversity($conn, $userID) {
        // Fetch user's university from Users table
        $stmt = $conn->prepare("SELECT University FROM Users WHERE UID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();
        return $row["University"];
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
