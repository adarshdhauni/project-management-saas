const PasswordStrength = ({ password, passwordStrength }) => {
  if (!password) {
    return null;
  }

  return (
    <div className="mt-3 flex gap-1">
      {["weak", "medium", "strong"].map((_level, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 transition-all duration-300 ${
            passwordStrength === "strong"
              ? "bg-foreground"
              : passwordStrength === "medium" && i < 2
                ? "bg-foreground/70"
                : passwordStrength === "weak" && i === 0
                  ? "bg-foreground/50"
                  : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );
};

export default PasswordStrength;
