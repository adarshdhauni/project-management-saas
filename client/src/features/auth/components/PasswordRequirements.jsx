const PasswordRequirements = ({ passwordRules }) => {
  return (
    <div className="text-xs text-black/45 space-y-1.5">
      <p className={passwordRules.length ? "text-black/80" : "text-black/40"}>
        • 8 to 64 characters
      </p>

      <p className={passwordRules.upper ? "text-black/80" : "text-black/40"}>
        • One uppercase letter
      </p>

      <p className={passwordRules.lower ? "text-black/80" : "text-black/40"}>
        • One lowercase letter
      </p>

      <p className={passwordRules.number ? "text-black/80" : "text-black/40"}>
        • One number
      </p>

      <p className={passwordRules.special ? "text-black/80" : "text-black/40"}>
        • One special character
      </p>
    </div>
  );
};

export default PasswordRequirements;
