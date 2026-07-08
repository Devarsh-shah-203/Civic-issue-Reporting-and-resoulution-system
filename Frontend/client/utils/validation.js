export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(String(phone || "").trim());
}

export function isStrongPassword(password) {
  return String(password || "").length >= 6;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";

  return errors;
}

export function validateRegisterForm({ name, email, phone, password, confirmPassword }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Enter your full name";

  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";

  if (!phone) errors.phone = "Phone number is required";
  else if (!isValidPhone(phone)) errors.phone = "Enter a valid 10-digit phone number";

  if (!password) errors.password = "Password is required";
  else if (!isStrongPassword(password)) errors.password = "Password must be at least 6 characters";

  if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";

  return errors;
}

export function validateReportForm({ title, description, category, location }) {
  const errors = {};
  if (!title || title.trim().length < 4) errors.title = "Give your report a short, clear title";
  if (!description || description.trim().length < 10)
    errors.description = "Add a few more details (10+ characters)";
  if (!category) errors.category = "Choose a category";
  if (!location || !location.lat || !location.lng)
    errors.location = "Pin the exact location on the map";

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
