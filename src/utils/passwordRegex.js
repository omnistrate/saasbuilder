export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

export const passwordText =
  "Password must be at least 8 characters and include a mix of uppercase, lowercase, a number, and a special character (e.g., !@#$%^&*).";
