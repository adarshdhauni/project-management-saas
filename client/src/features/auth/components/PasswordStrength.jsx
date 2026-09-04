const PasswordStrength = ({ password, passwordStrength }) => {
  if (!password) {
    return null;
  }

  return (
    <div className="flex gap-1 mt-3">
      {["weak", "medium", "strong"].map((_level, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 transition-all duration-300 ${
            passwordStrength === "strong"
              ? "bg-black"
              : passwordStrength === "medium" && i < 2
                ? "bg-black/70"
                : passwordStrength === "weak" && i === 0
                  ? "bg-black/50"
                  : "bg-black/10"
          }`}
        />
      ))}
    </div>
  );
};

export default PasswordStrength;
