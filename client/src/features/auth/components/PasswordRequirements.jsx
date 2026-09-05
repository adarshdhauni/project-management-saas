const PasswordRequirements = ({ passwordRules }) => {
  return (
    <div className="space-y-1.5 text-xs text-muted-foreground">
      <p
        className={
          passwordRules.length
            ? "text-foreground/80"
            : "text-muted-foreground/60"
        }
      >
        • 8 to 64 characters
      </p>

      <p
        className={
          passwordRules.upper
            ? "text-foreground/80"
            : "text-muted-foreground/60"
        }
      >
        • One uppercase letter
      </p>

      <p
        className={
          passwordRules.lower
            ? "text-foreground/80"
            : "text-muted-foreground/60"
        }
      >
        • One lowercase letter
      </p>

      <p
        className={
          passwordRules.number
            ? "text-foreground/80"
            : "text-muted-foreground/60"
        }
      >
        • One number
      </p>

      <p
        className={
          passwordRules.special
            ? "text-foreground/80"
            : "text-muted-foreground/60"
        }
      >
        • One special character
      </p>
    </div>
  );
};

export default PasswordRequirements;
