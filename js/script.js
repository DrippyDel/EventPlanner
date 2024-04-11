// // Function to handle user login form submission
// function handleLogin(event) {
//   event.preventDefault(); // Prevent form submission

//   // Get form input values
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   // Validate form inputs
//   if (!validateEmail(email)) {
//     alert("Please enter a valid email address");
//     return;
//   }

//   if (password.trim() === "") {
//     alert("Please enter a password");
//     return;
//   }

//   // Prepare data for POST request
//   const formData = {
//     email: email,
//     password: password,
//   };

//   // Send POST request to API for user login
//   fetch("http://localhost/api.php?action=login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // Display success message or error message from API response
//       alert(data.message);
//       // Reset form fields if login is successful
//       if (data.message === "Login successful") {
//         // Redirect user to event_listing.html after successful login
//         window.location.href = "event_listing.html";
//         // Optionally, you can also reset the form fields here
//         document.getElementById("loginForm").reset();
//       }
//     })
//     .catch((error) => {
//       console.error("Error logging in:", error);
//       alert("An error occurred while logging in. Please try again later.");
//     });
// }

// Get the modal
var modal = document.getElementById("createRSOModal");

// Get the button that opens the modal
var createRSOButton = document.querySelector(".createRSOButton");

// Get the <span> element that closes the modal
var closeBtn = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
createRSOButton.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Form submission handling
document
  .getElementById("createRSOForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    var rsoName = document.getElementById("rsoName").value;
    var description = document.getElementById("description").value;

    // You can perform validation here before sending the data to the backend

    // Assuming you have a function to send data to the backend
    sendDataToBackend(rsoName, description);

    // Close the modal after form submission
    modal.style.display = "none";
  });

// Function to send data to the backend (replace this with your actual implementation)
function sendDataToBackend(rsoName, description) {
  // Implement sending data to the backend here
  console.log("RSO Name: " + rsoName);
  console.log("Description: " + description);
}

// Function to handle event creation form submission
function handleEventCreation(event) {
  event.preventDefault(); // Prevent form submission

  // Get form input values
  const eventName = document.getElementById("eventName").value;
  const eventCategory = document.getElementById("eventCategory").value;
  const eventDescription = document.getElementById("eventDescription").value;

  // Validate form inputs
  if (eventName.trim() === "") {
    alert("Please enter an event name");
    return;
  }

  if (eventCategory === "") {
    alert("Please select an event category");
    return;
  }

  if (eventDescription.trim() === "") {
    alert("Please enter an event description");
    return;
  }

  // Prepare data for POST request
  const formData = {
    eventName: eventName,
    eventCategory: eventCategory,
    eventDescription: eventDescription,
  };

  // Send POST request to API for event creation
  fetch("http://localhost/api.php?action=createEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display success message or error message from API response
      alert(data.message);
      // Reset form fields if event creation is successful
      if (data.message === "Event created successfully") {
        document.getElementById("eventCreationForm").reset();
      }
    })
    .catch((error) => {
      console.error("Error creating event:", error);
      alert(
        "An error occurred while creating the event. Please try again later."
      );
    });
}

// Function to fetch and display events
function fetchEvents() {
  // Fetch events from API
  fetch("http://localhost/api.php?action=getEvents")
    .then((response) => response.json())
    .then((data) => {
      // Display events on the webpage
      const eventList = document.getElementById("eventList");
      eventList.innerHTML = ""; // Clear previous event list

      data.forEach((event) => {
        const eventItem = document.createElement("li");
        eventItem.textContent = `${event.name} - ${event.category}`;
        eventList.appendChild(eventItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      alert("An error occurred while fetching events. Please try again later.");
    });
}

// For the event creation page
const eventCreationForm = document.getElementById("eventCreationForm");
if (eventCreationForm) {
  eventCreationForm.addEventListener("submit", handleEventCreation);
}

// Fetch and display events on page load
document.addEventListener("DOMContentLoaded", fetchEvents);

// Add event listener to toggle between forms
document.querySelectorAll(".toggle-btn").forEach((button) => {
  button.addEventListener("click", toggleForm);
});

// Event to redirect user to create_event.html when "Add" button is clicked
document.getElementById("addButton").addEventListener("click", function () {
  window.location.href = "create_event.html";
});
