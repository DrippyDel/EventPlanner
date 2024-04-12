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
// Retrieve user data from local storage
const userData = JSON.parse(localStorage.getItem("user"));

// Check if user data exists and if the username is available
if (userData && userData.Username) {
  // If the username is available, update the welcome message
  document.getElementById("greet-user").textContent = userData.Username;
} else {
  // If the username is not available, display a default welcome message
  document.getElementById("greet-user").textContent = "User";
}

// Retrieve user data from local storage
const user = JSON.parse(localStorage.getItem("user"));

// Check if user data exists and if the user has admin privileges
if (user && user.Privileges === "admin") {
  // If the user has admin privileges, display the addButton
  document.getElementById("addButton").style.display = "block";
} else {
  // If the user does not have admin privileges, hide the addButton
  document.getElementById("addButton").style.display = "none";
}

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

// Get the button for joining RSO
var joinRSOButton = document.getElementById("joinRSOButton");

// When the user clicks the "Join RSO" button, open the modal
joinRSOButton.onclick = function () {
  joinRSOModal.style.display = "block";
};

// Get the modal for joining RSO
var joinRSOModal = document.getElementById("joinRSOModal");

// Get the <span> element that closes the "Join RSO" modal
var closeJoinRSOBtn = document.getElementById("closeJoinRSO");

// When the user clicks on <span> (x) inside the "Join RSO" modal, close it
closeJoinRSOBtn.onclick = function () {
  joinRSOModal.style.display = "none";
};

// When the user clicks anywhere outside of the "Join RSO" modal, close it
window.onclick = function (event) {
  if (event.target == joinRSOModal) {
    joinRSOModal.style.display = "none";
  }
};

// Get the button for adding a school
var addSchoolButton = document.getElementById("addSchoolButton");

// When the user clicks the "Add School" button, open the modal
addSchoolButton.onclick = function () {
  addSchoolModal.style.display = "block";
};

// Get the modal for adding a school
var addSchoolModal = document.getElementById("addSchoolModal");

// Get the <span> element that closes the "Add School" modal
var closeAddSchoolBtn = document.getElementById("closeAddSchool");

// When the user clicks on <span> (x) inside the "Add School" modal, close it
closeAddSchoolBtn.onclick = function () {
  addSchoolModal.style.display = "none";
};

// When the user clicks anywhere outside of the "Add School" modal, close it
window.onclick = function (event) {
  if (event.target == addSchoolModal) {
    addSchoolModal.style.display = "none";
  }
};

// createRSOForm submission handling
document
  .getElementById("createRSOForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    var rsoName = document.getElementById("rsoName").value;
    var description = document.getElementById("description").value;

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

    /// Construct the data object to be sent to the endpoint
    const formData = {
      username: username,
      RSOName: rsoName,
      description: description,
    };

    // Make a POST request to the endpoint
    fetch("http://104.131.71.40/LAMPAPI/CreateRSO.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Failed to create RSO: " + data.error);
        } else {
          alert("RSO created successfully");
        }
      })
      .catch((error) => {
        console.error("Error creating RSO:", error);
        // Handle errors if the request fails
        alert(
          "An error occurred while creating the RSO. Please try again later."
        );
      });

    // Close the modal after form submission
    modal.style.display = "none";
  });

// joinRSOForm submission handling
document
  .getElementById("joinRSOForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    var rsoNameToJoin = document.getElementById("rsoNameToJoin").value;

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

    /// Construct the data object to be sent to the endpoint
    const formData = {
      username: username,
      RSOName: rsoNameToJoin,
    };

    // Make a POST request to the endpoint
    fetch("http://104.131.71.40/LAMPAPI/JoinRSO.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Failed to join RSO: " + data.error);
        } else {
          alert("Joined RSO successfully");
        }
      })
      .catch((error) => {
        console.error("Error creating RSO:", error);
        // Handle errors if the request fails
        alert(
          "An error occurred while creating the RSO. Please try again later."
        );
      });

    // Close the modal after form submission
    modal.style.display = "none";
  });

// addSchoolForm submission handling
document
  .getElementById("addSchoolForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    var schoolName = document.getElementById("schoolName").value;
    var schoolAddress = document.getElementById("schoolAddress").value;
    var schoolLatitude = document.getElementById("schoolLatitude").value;
    var schoolLongitude = document.getElementById("schoolLongitude").value;

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

    /// Construct the data object to be sent to the endpoint
    const formData = {
      username: username,
      schoolName: schoolName,
      address: schoolAddress,
      longitude: schoolLatitude,
      latitude: schoolLongitude,
    };

    // Make a POST request to the endpoint
    fetch("http://104.131.71.40/LAMPAPI/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Failed to add school: " + data.error);
        } else {
          alert("School added successfully");
        }
      })
      .catch((error) => {
        console.error("Error creating RSO:", error);
        // Handle errors if the request fails
        alert(
          "An error occurred while creating the RSO. Please try again later."
        );
      });

    // Close the modal after form submission
    modal.style.display = "none";
  });

// Function to fetch and display events
function fetchEvents() {
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

  // Fetch events from API
  fetch("http://104.131.71.40/LAMPAPI/GetEventsByUser.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
  })
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
