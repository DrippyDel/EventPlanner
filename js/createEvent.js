// Function to handle event creation form submission
function handleEventCreation(event) {
  event.preventDefault(); // Prevent form submission

  // Get form input values
  const eventName = document.getElementById("eventName").value;
  const eventType = document.getElementById("eventType").value;
  const eventDate = document.getElementById("eventDate").value;
  const eventTime = document.getElementById("eventTime").value;
  const eventDescription = document.getElementById("eventDescription").value;
  const eventLocationName = document.getElementById("eventLocationName").value;
  const eventAddress = document.getElementById("eventAddress").value;
  const eventPermission = document.getElementById("eventPermission").value;

  console.log("eventName: " + eventName);
  console.log("eventType: " + eventType);
  console.log("eventDate: " + eventDate);
  console.log("eventTime: " + eventTime);
  console.log("eventDescription: " + eventDescription);
  console.log("eventLocationName: " + eventLocationName);
  console.log("eventAddress: " + eventAddress);
  console.log("eventPermission: " + eventPermission);

  // Validate form inputs
  if (eventName.trim() === "") {
    alert("Please enter an event name");
    return;
  }

  if (eventDescription.trim() === "") {
    alert("Please enter an event description");
    return;
  }

  const userData = JSON.parse(localStorage.getItem("user"));
  let username;

  // Check if user data exists
  if (userData) {
    // Access the username property
    username = userData.Username;
    console.log("Username:", username);
  } else {
    console.log("User data not found in local storage");
  }

  // Prepare data for POST request
  const formData = {
    username: username,
    eventName: eventName,
    eventType: eventType,
    description: eventDescription,
    eventDay: eventDate,
    eventTime: eventTime,
    location: eventLocationName,
    locationAddress: eventAddress,
    superAdminID: eventPermission,
  };

  // Send POST request to API for event creation
  fetch("http://104.131.71.40/LAMPAPI/CreateEvent.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Failed to create event: " + data.error);
      } else {
        alert("Event created successfully");
      }

      document.getElementById("eventCreationForm").reset();
    })
    .catch((error) => {
      console.error("Error creating event:", error);
      alert(
        "An error occurred while creating the event. Please try again later."
      );
    });
}

// For the event creation page
const eventCreationForm = document.getElementById("eventCreationForm");
if (eventCreationForm) {
  eventCreationForm.addEventListener("submit", handleEventCreation);
}
