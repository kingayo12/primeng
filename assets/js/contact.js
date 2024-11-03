const form = document.getElementById("contact-form");
const statusTxt = form.querySelector(".submit-btn span");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check if all fields are filled
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]");
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("invalid");
    } else {
      input.classList.remove("invalid");
    }
  });

  // Check if reCAPTCHA is checked
  const reCAPTCHAResponse = grecaptcha.getResponse();
  if (!reCAPTCHAResponse.trim()) {
    isValid = false;
    const recaptchaDiv = form.querySelector(".g-recaptcha");
    recaptchaDiv.classList.add("invalid");
  } else {
    const recaptchaDiv = form.querySelector(".g-recaptcha");
    recaptchaDiv.classList.remove("invalid");
  }

  if (!isValid) {
    // Some required fields are not filled or reCAPTCHA is not checked
    statusTxt.innerText = "Please fill out all fields and verify reCAPTCHA.";
    statusTxt.style.color = "red";
    statusTxt.style.display = "block";
    return;
  }

  statusTxt.style.color = "#0D6EFD";
  statusTxt.style.display = "block";
  statusTxt.innerText = "Sending your message...";
  form.classList.add("disabled");

  let formData = new FormData(form);
  fetch(form.action, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((response) => {
      if (
        response.includes("Email and message field is required!") ||
        response.includes("Enter a valid email address!") ||
        response.includes("Sorry, failed to send your message!")
      ) {
        statusTxt.style.color = "red";
      } else {
        form.reset();
        setTimeout(() => {
          statusTxt.style.display = "none";
        }, 3000);
      }
      statusTxt.innerText = response;
      form.classList.remove("disabled");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});