const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://e-commerce-store-3-guwg.onrender.com";

const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup-button");
const messageDisplay = document.getElementById("message");

function setMessage(text, isError = false) {
  messageDisplay.textContent = text;
  messageDisplay.style.color = isError ? "#ffd4d4" : "#e5ffe7";
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!name || !email || !password || !confirmPassword) {
    setMessage("Please fill in all fields.", true);
    return;
  }

  if (password.length < 6) {
    setMessage("Password must be at least 6 characters long.", true);
    return;
  }

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.", true);
    return;
  }

  signupButton.disabled = true;
  setMessage("Creating your account...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Could not create your account.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setMessage("Account created. Opening store...");
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  } catch (error) {
    setMessage(
      error.message === "Failed to fetch"
        ? "Cannot connect to the store. Please try again shortly."
        : error.message,
      true,
    );
  } finally {
    signupButton.disabled = false;
  }
});
