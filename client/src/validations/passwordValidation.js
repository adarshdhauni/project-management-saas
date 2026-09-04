export const getPasswordValidation = (password = "") => {
  const passwordRules = {
    length: password.length >= 8 && password.length <= 64,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  };

  const passedRules = Object.values(passwordRules).filter(Boolean).length;

  let passwordStrength = "weak";

  if (passedRules === 5) {
    passwordStrength = "strong";
  } else if (passedRules >= 3) {
    passwordStrength = "medium";
  }

  return {
    passwordRules,
    passwordStrength,
  };
};
