// Function to validate email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Function to toggle between registration and login forms using flip animation
function toggleForm() {
  const container = document.getElementById("container");
  container.classList.toggle("flip");
}

// Function to handle user registration form submission
function handleRegistration(event) {
  event.preventDefault(); // Prevent form submission

  // Get form input values
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validate form inputs
  if (username.trim() === "") {
    alert("Please enter a username");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (password.trim() === "") {
    alert("Please enter a password");
    return;
  }

  // Prepare data for POST request
  const formData = {
    username: username,
    email: email,
    password: password,
  };

  // Send POST request to API for user registration
  fetch("http://localhost/api.php?action=register", {
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
      // Reset form fields if registration is successful
      if (data.message === "User registered successfully") {
        document.getElementById("registrationForm").reset();
      }
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      alert("An error occurred while registering. Please try again later.");
    });
}

// Function to handle user login form submission
function handleLogin(event) {
  event.preventDefault(); // Prevent form submission

  // Get form input values
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Validate form inputs
  if (!validateEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (password.trim() === "") {
    alert("Please enter a password");
    return;
  }

  // Prepare data for POST request
  const formData = {
    email: email,
    password: password,
  };

  // Send POST request to API for user login
  fetch("http://localhost/api.php?action=login", {
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
      // Reset form fields if login is successful
      if (data.message === "Login successful") {
        document.getElementById("loginForm").reset();
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in. Please try again later.");
    });
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

// Add event listeners to form submissions
const eventRegistrationForm = document.getElementById("registrationForm");
if (eventRegistrationForm) {
  eventRegistrationForm.addEventListener("submit", handleRegistration);
}

// For the login page
const eventLoginForm = document.getElementById("loginForm");
if (eventLoginForm) {
  eventLoginForm.addEventListener("submit", handleLogin);
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
