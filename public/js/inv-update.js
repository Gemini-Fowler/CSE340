// inv-update.js

// Select the form by its ID
const form = document.querySelector("#updateForm");

// Listen for any change within the form
form.addEventListener("change", function () {
  // Select the submit button
  const updateBtn = document.querySelector("button");

  // Enable the button once a change is detected
  updateBtn.removeAttribute("disabled");
});