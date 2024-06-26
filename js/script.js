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
if (user && user.Privileges === "Admin") {
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

// Get the search input element
const searchInput = document.getElementById("searchInput");

// Add event listener for the "keyup" event on the search input
searchInput.addEventListener("keyup", function (event) {
  // Get the search query entered by the user
  const searchQuery = event.target.value.trim();

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("user"));
  const username = userData ? userData.Username : "";

  // Prepare the request payload
  const payload = {
    username: username,
    search: searchQuery,
  };

  // Make a POST request to the SearchEvents endpoint
  fetch("http://104.131.71.40/LAMPAPI/SearchEvents.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the search results
      displaySearchResults(data);
    })
    .catch((error) => {
      console.error("Error searching events:", error);
      // Handle error if the request fails
      alert(
        "An error occurred while searching events. Please try again later."
      );
    });
});

// Function to display search results on the webpage
function displaySearchResults(results) {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = ""; // Clear previous event list

  if (results && results.length > 0) {
    results.forEach((event) => {
      // Create event card
      const eventCard = document.createElement("div");
      eventCard.classList.add("event-card");

      // Populate event card with event data
      const eventProperties = [
        { label: "Event Name", value: event.Event_name },
        { label: "Location Name", value: event.Location },
        { label: "Address", value: event.Location_Address },
        { label: "Description", value: event.Description },
        { label: "Type", value: event.EventType },
        {
          label: "Date & Time",
          value: `${formatDate(event.Event_Day)}, ${formatTime(
            event.Event_Time
          )}`,
        },
      ];

      // Create event properties container
      const eventPropertiesContainer = document.createElement("div");
      eventPropertiesContainer.classList.add("event-properties");

      // Populate event properties container with event data
      eventProperties.forEach((prop) => {
        const p = document.createElement("p");
        p.textContent = `${prop.label}: ${prop.value}`;
        eventPropertiesContainer.appendChild(p);
      });

      // Append event properties container to the event card
      eventCard.appendChild(eventPropertiesContainer);

      // Create comment section dropdown
      const commentSection = document.createElement("div");
      commentSection.classList.add("comment-section");

      const commentToggleBtn = document.createElement("button");
      commentToggleBtn.innerHTML =
        "<img src='../pic/icons8-dropdown-arrow-50.png' alt='Toggle Comments' style='width: 16px; height: 16px;'><span style='margin-left: 5px;'>Comments</span>";
      commentToggleBtn.style.backgroundColor = "white";
      commentToggleBtn.style.color = "black";
      commentToggleBtn.classList.add("comment-toggle-btn");

      const commentList = document.createElement("ul");
      commentList.classList.add("comment-list");

      // Fetch comments for this event
      fetchComments(event.Events_ID)
        .then((comments) => {
          // Display comments
          comments.forEach((comment) => {
            // Create a comment card
            const commentCard = document.createElement("div");
            commentCard.classList.add("comment-card");

            // Display comment details
            const commentDetails = document.createElement("div");
            commentDetails.classList.add("comment-details");

            const commentUsername = document.createElement("p");
            commentUsername.classList.add("comment-username");
            commentUsername.textContent = comment.Username;
            commentDetails.appendChild(commentUsername);

            const commentText = document.createElement("p");
            commentText.classList.add("comment-text");
            commentText.textContent = comment.Text;
            commentDetails.appendChild(commentText);

            const commentTimestamp = document.createElement("p");
            commentTimestamp.classList.add("comment-timestamp");
            commentTimestamp.textContent = getFormattedTimestamp(
              comment.Timestamp
            );
            commentDetails.appendChild(commentTimestamp);

            commentCard.appendChild(commentDetails);

            // Add edit and delete buttons for each comment
            const editButton = document.createElement("button");
            editButton.innerHTML =
              "<img src='../pic/icons8-edit-24.png' alt='Edit' style='width: 13px; height: 16px;'>";
            editButton.style.backgroundColor = "transparent";
            editButton.addEventListener("click", () => {
              // Handle edit functionality
              const updatedText = prompt("Enter the updated comment:");
              if (updatedText !== null && updatedText.trim() !== "") {
                const commentID = comment.Comment_ID;
                editComment(userData.Username, commentID, updatedText);
              } else {
                alert("Please enter a valid comment.");
              }
            });

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML =
              "<img src='../pic/icons8-delete-24.png' alt='Delete' style='width: 16px; height: 16px;'>";
            deleteButton.style.backgroundColor = "transparent";
            deleteButton.addEventListener("click", () => {
              // Handle delete functionality
              if (confirm("Are you sure you want to delete this comment?")) {
                const commentID = comment.Comment_ID;
                deleteComment(userData.Username, commentID);
              }
            });

            commentCard.appendChild(editButton);
            commentCard.appendChild(deleteButton);

            // Append the comment card to the comment list
            commentList.appendChild(commentCard);
          });
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          // Handle error if needed
        });

      const commentInput = document.createElement("textarea");
      commentInput.classList.add("comment-input");
      commentInput.placeholder = "Add a comment";

      const commentSubmitBtn = document.createElement("button");
      commentSubmitBtn.classList.add("comment-submit");
      commentSubmitBtn.textContent = "Submit";

      // Event listener for comment submission
      commentSubmitBtn.addEventListener("click", () => {
        const commentText = commentInput.value.trim();
        if (commentText !== "") {
          // Call the submitComment function
          submitComment(event.Events_ID, userData.Username, commentText);
          // Clear the comment input field after submission
          commentInput.value = "";
        } else {
          // Display an error message if the comment text is empty
          alert("Please enter a comment before submitting.");
        }
      });

      // Toggle button event listener
      commentToggleBtn.addEventListener("click", () => {
        // Toggle comment section visibility
        commentList.style.display =
          commentList.style.display === "none" ? "block" : "none";
        commentInput.style.display =
          commentInput.style.display === "none" ? "block" : "none";
        commentSubmitBtn.style.display =
          commentSubmitBtn.style.display === "none" ? "block" : "none";
      });

      // Append elements to the comment section
      commentSection.appendChild(commentToggleBtn);
      commentSection.appendChild(commentList);
      commentSection.appendChild(commentInput);
      commentSection.appendChild(commentSubmitBtn);

      // Append the comment section to the event card
      eventCard.appendChild(commentSection);

      // Append the event card to the event list
      eventList.appendChild(eventCard);
    });
  } else {
    // Display a message if no events were found
    eventList.innerHTML = "<p>No events found.</p>";
  }
}

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
        console.error("Error joining RSO:", error);
        // Handle errors if the request fails
        alert(
          "An error occurred while joining the RSO. Please try again later."
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

    console.log(formData);

    // Make a POST request to the endpoint
    fetch("http://104.131.71.40/LAMPAPI/AddSchool.php", {
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
        console.error("Error adding school:", error);
        // Handle errors if the request fails
        alert("An error occurred while adding school. Please try again later.");
      });

    // Close the modal after form submission
    modal.style.display = "none";
  });

// Function to handle comment submission
function submitComment(eventId, username, text) {
  // Prepare the request payload
  const payload = {
    username: username,
    text: text,
    rating: null, // You may add rating functionality if needed
    eventsID: eventId,
  };

  // Make a POST request to the Create Comment endpoint
  fetch("http://104.131.71.40/LAMPAPI/CreateComment.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle successful comment submission
      alert("Comment submitted successfully");

      // Update the UI to reflect the new comment
      const commentList = document.querySelector(
        `#event-${eventId} .comment-list`
      );
      const newComment = document.createElement("li");
      newComment.textContent = text;
      commentList.appendChild(newComment);
    })
    .catch((error) => {
      // Handle error
      console.error("Error submitting comment:", error);
      // Display an error message to the user if needed
    });
}

// Function to fetch and display events
function fetchEvents() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const username = userData ? userData.Username : "";

  // Fetch events from API
  fetch("http://104.131.71.40/LAMPAPI/GetEventsByUser.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
  })
    .then((response) => {
      console.log("Inside response in fetchEvents()");
      return response.json();
    })
    .then((data) => {
      console.log("Event data:");
      console.log(data);
      // Display events on the webpage
      const eventList = document.getElementById("eventList");
      eventList.innerHTML = ""; // Clear previous event list

      data.forEach((event) => {
        const eventId = event.Events_ID;

        // Create event card
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        // Populate event card with event data
        const eventProperties = [
          { label: "Event Name", value: event.Event_name },
          { label: "Location Name", value: event.Location },
          { label: "Address", value: event.Location_Address },
          { label: "Description", value: event.Description },
          { label: "Type", value: event.EventType },
          {
            label: "Date & Time",
            value: `${formatDate(event.Event_Day)}, ${formatTime(
              event.Event_Time
            )}`,
          },
        ];

        // Create event properties container
        const eventPropertiesContainer = document.createElement("div");
        eventPropertiesContainer.classList.add("event-properties");

        // Populate event properties container with event data
        eventProperties.forEach((prop) => {
          const p = document.createElement("p");
          p.textContent = `${prop.label}: ${prop.value}`;
          eventPropertiesContainer.appendChild(p);
        });

        // Append event properties container to the event card
        eventCard.appendChild(eventPropertiesContainer);

        // Create comment section dropdown
        const commentSection = document.createElement("div");
        commentSection.classList.add("comment-section");

        const commentToggleBtn = document.createElement("button");
        commentToggleBtn.innerHTML =
          "<img src='../pic/icons8-dropdown-arrow-50.png' alt='Toggle Comments' style='width: 16px; height: 16px;'><span style='margin-left: 5px;'>Comments</span>";
        commentToggleBtn.style.backgroundColor = "white";
        commentToggleBtn.style.color = "black";
        commentToggleBtn.classList.add("comment-toggle-btn");

        const commentList = document.createElement("ul");
        commentList.classList.add("comment-list");

        // Fetch comments for this event
        fetchComments(eventId)
          .then((comments) => {
            // Display comments
            comments.forEach((comment) => {
              // Create a comment card
              const commentCard = document.createElement("div");
              commentCard.classList.add("comment-card");

              // Display comment details
              const commentDetails = document.createElement("div");
              commentDetails.classList.add("comment-details");

              const commentUsername = document.createElement("p");
              commentUsername.classList.add("comment-username");
              commentUsername.textContent = comment.Username;
              commentDetails.appendChild(commentUsername);

              const commentText = document.createElement("p");
              commentText.classList.add("comment-text");
              commentText.textContent = comment.Text;
              commentDetails.appendChild(commentText);

              const commentTimestamp = document.createElement("p");
              commentTimestamp.classList.add("comment-timestamp");
              commentTimestamp.textContent = getFormattedTimestamp(
                comment.Timestamp
              );
              commentDetails.appendChild(commentTimestamp);

              commentCard.appendChild(commentDetails);

              // Add edit and delete buttons for each comment
              const editButton = document.createElement("button");
              editButton.innerHTML =
                "<img src='../pic/icons8-edit-24.png' alt='Edit' style='width: 13px; height: 16px;'>";
              editButton.style.backgroundColor = "transparent";
              editButton.addEventListener("click", () => {
                // Handle edit functionality
                const updatedText = prompt("Enter the updated comment:");
                if (updatedText !== null && updatedText.trim() !== "") {
                  const commentID = comment.Comment_ID;
                  editComment(username, commentID, updatedText);
                } else {
                  alert("Please enter a valid comment.");
                }
              });

              const deleteButton = document.createElement("button");
              deleteButton.innerHTML =
                "<img src='../pic/icons8-delete-24.png' alt='Delete' style='width: 16px; height: 16px;'>";
              deleteButton.style.backgroundColor = "transparent";
              deleteButton.addEventListener("click", () => {
                // Handle delete functionality
                if (confirm("Are you sure you want to delete this comment?")) {
                  const commentID = comment.Comment_ID;
                  deleteComment(username, commentID);
                }
              });

              commentCard.appendChild(editButton);
              commentCard.appendChild(deleteButton);

              // Append the comment card to the comment list
              commentList.appendChild(commentCard);
            });
          })
          .catch((error) => {
            console.error("Error fetching comments:", error);
            // Handle error if needed
          });

        const commentInput = document.createElement("textarea");
        commentInput.classList.add("comment-input");
        commentInput.placeholder = "Add a comment";

        const commentSubmitBtn = document.createElement("button");
        commentSubmitBtn.classList.add("comment-submit");
        commentSubmitBtn.textContent = "Submit";

        // Event listener for comment submission
        commentSubmitBtn.addEventListener("click", () => {
          const commentText = commentInput.value.trim();
          if (commentText !== "") {
            // Call the submitComment function
            submitComment(eventId, username, commentText);
            // Clear the comment input field after submission
            commentInput.value = "";
          } else {
            // Display an error message if the comment text is empty
            alert("Please enter a comment before submitting.");
          }
        });

        // Toggle button event listener
        commentToggleBtn.addEventListener("click", () => {
          // Toggle comment section visibility
          commentList.style.display =
            commentList.style.display === "none" ? "block" : "none";
          commentInput.style.display =
            commentInput.style.display === "none" ? "block" : "none";
          commentSubmitBtn.style.display =
            commentSubmitBtn.style.display === "none" ? "block" : "none";
        });

        // Append elements to the comment section
        commentSection.appendChild(commentToggleBtn);
        commentSection.appendChild(commentList);
        commentSection.appendChild(commentInput);
        commentSection.appendChild(commentSubmitBtn);

        // Append the comment section to the event card
        eventCard.appendChild(commentSection);

        // Append the event card to the event list
        eventList.appendChild(eventCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      alert(
        "An error occurred while fetching events. If you're new please add the school you're attending and refresh the page."
      );
    });
}

// // Function to format timestamp
// function getFormattedTimestamp(timestamp) {
//   const date = new Date(timestamp);
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const day = days[date.getDay()];
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const period = hours < 12 ? "am" : "pm";
//   const formattedHours = hours % 12 || 12;
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//   return `${day}, ${month} ${date.getDate()}, ${year} ${formattedHours}:${formattedMinutes} ${period}`;
// }

// // Function to format date
// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const day = days[date.getDay()];
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();
//   return `${day}, ${month} ${date.getDate()}, ${year}`;
// }

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  return date.toLocaleString("en-US", options);
}

// Function to format time
function formatTime(timeString) {
  const time = new Date(`1970-01-01T${timeString}`);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const period = hours < 12 ? "am" : "pm";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

// Function to format timestamp into a more readable format
function getFormattedTimestamp(timestamp) {
  const date = new Date(timestamp);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = days[date.getDay()];
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "am" : "pm";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${day} ${formattedHours}:${formattedMinutes} ${period}`;
}

// Function to fetch comments for a specific event
async function fetchComments(eventId) {
  try {
    const response = await fetch(
      `http://104.131.71.40/LAMPAPI/GetCommentsByEvent.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "Drippy", eventID: eventId }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

// Function to edit a comment
function editComment(username, commentID, updatedText) {
  const payload = {
    username: username,
    commentID: commentID,
    updatedText: updatedText,
    updatedRating: null, // You may include rating if needed
  };

  fetch("http://104.131.71.40/LAMPAPI/EditComment.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message); // Display success message
      // You can update the UI to reflect the edited comment if needed
    })
    .catch((error) => {
      console.error("Error editing comment:", error);
      alert("An error occurred while editing the comment.");
    });
}

// Function to delete a comment
function deleteComment(username, commentID) {
  const payload = {
    username: username,
    commentID: commentID,
  };

  fetch("http://104.131.71.40/LAMPAPI/DeleteComment.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message); // Display success message
      // You can update the UI to remove the deleted comment if needed
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
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

// Get the logout button element
const logoutButton = document.getElementById("logoutButton");

// Add click event listener to the logout button
logoutButton.addEventListener("click", () => {
  // Ask the user for confirmation
  const confirmLogout = confirm("Are you sure you want to log out?");

  // If the user confirms, proceed with logout
  if (confirmLogout) {
    // Remove the user from local storage
    localStorage.removeItem("user");

    // Redirect to index.html
    window.location.href = "index.html";
  }
});
