// Event to toggle between Login and Registration Form
const toggleFormElement = document.getElementById("toggleForm");
if (toggleFormElement) {
  toggleFormElement.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default action of clicking a link

    // Toggle the visibility of forms
    document.getElementById("loginForm").classList.toggle("hidden");
    document.getElementById("registerForm").classList.toggle("hidden");

    // Change link text based on visibility
    var linkText = document
      .getElementById("registerForm")
      .classList.contains("hidden")
      ? "Register"
      : "Login";
    document.querySelector("#toggleForm a").textContent = linkText;

    // Update heading text
    var headingText = document
      .getElementById("registerForm")
      .classList.contains("hidden")
      ? "Login"
      : "Register";
    document.querySelector("#formContainer h2").textContent = headingText;
  });
}

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
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("newUsername").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  // Live validation for username
  const usernameError = document.getElementById("usernameError");
  if (username.length < 5) {
    usernameError.textContent =
      "❌ Username must be at least 5 characters long";
  } else {
    usernameError.textContent =
      "✅ Username must be at least 5 characters long";
    usernameError.classList.add("valid");
  }

  // Live validation for email
  const emailError = document.getElementById("emailError");
  if (!validateEmail(email)) {
    emailError.textContent = "❌ Please enter a valid email address";
  } else {
    emailError.textContent = "✅ Please enter a valid email address";
    emailError.classList.add("valid");
  }

  // Live validation for password
  const passwordError = document.getElementById("passwordError");
  if (password.length < 5) {
    passwordError.textContent =
      "❌ Password must be at least 5 characters long";
  } else {
    passwordError.textContent =
      "✅ Password must be at least 5 characters long";
    passwordError.classList.add("valid");
  }

  // All fields are valid, proceed with registration
  console.log(`after document.querySelectorAll(".initial-error")`);
  // Prepare data for POST request
  const formData = {
    FirstName: firstName,
    LastName: lastName,
    Username: username,
    Email: email,
    Password: password,
    University: "",
    Privileges: "",
  };

  console.log(formData);

  // Send POST request to API for user registration
  fetch("http://104.131.71.40/LAMPAPI/CreateUser.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Reset form fields if registration is successful
      if (data.error === "") {
        localStorage.setItem("user", JSON.stringify(data));
        console.log(`inside data.error === ""`);
        // Redirect user to event_listing.html after successful login
        window.location.href = "event_listing.html";
        // Optionally, you can also reset the form fields here
        document.getElementById("registerForm").reset();
      }
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      alert("An error occurred while registering. Please try again later.");
    });
}

// Add event listeners for live validation
document.getElementById("newUsername").addEventListener("input", function () {
  const username = document.getElementById("newUsername").value;
  const usernameError = document.getElementById("usernameError");
  if (username.length < 5) {
    usernameError.textContent =
      "❌ Username must be at least 5 characters long";
    usernameError.classList.remove("valid");
  } else {
    usernameError.textContent =
      "✅ Username must be at least 5 characters long";
    usernameError.classList.add("valid");
  }
});

document.getElementById("newEmail").addEventListener("input", function () {
  const email = document.getElementById("newEmail").value;
  const emailError = document.getElementById("emailError");
  if (!validateEmail(email)) {
    emailError.textContent = "❌ Please enter a valid email address";
    emailError.classList.remove("valid");
  } else {
    emailError.textContent = "✅ Please enter a valid email address";
    emailError.classList.add("valid");
  }
});

document.getElementById("newPassword").addEventListener("input", function () {
  const password = document.getElementById("newPassword").value;
  const passwordError = document.getElementById("passwordError");
  if (password.length < 4) {
    passwordError.textContent =
      "❌ Password must be at least 4 characters long";
    passwordError.classList.remove("valid");
  } else {
    passwordError.textContent =
      "✅ Password must be at least 4 characters long";
    passwordError.classList.add("valid");
  }
});

// Function to handle user login form submission
function handleLogin(event) {
  event.preventDefault(); // Prevent form submission

  // Get form input values
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  console.log("username: " + username);
  console.log("password: " + password);

  // Prepare data for POST request
  const formData = {
    Username: username,
    Password: password,
  };

  console.log(formData);

  // Send POST request to API for user login
  fetch("http://104.131.71.40/LAMPAPI/Login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log("Inside the response");
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Reset form fields if login is successful
      if (data.error === "") {
        console.log(`Inside: if (data.error === "")`);
        localStorage.setItem("user", JSON.stringify(data));
        // Redirect user to event_listing.html after successful login
        window.location.href = "event_listing.html";
        // Optionally, you can also reset the form fields here
        document.getElementById("loginForm").reset();
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in. Please try again later.");
    });
}

// Add event listeners to form submissions
const eventRegistrationForm = document.getElementById("registerForm");
if (eventRegistrationForm) {
  eventRegistrationForm.addEventListener("submit", handleRegistration);
}

// For the login page
const eventLoginForm = document.getElementById("loginForm");
if (eventLoginForm) {
  eventLoginForm.addEventListener("submit", handleLogin);
}
