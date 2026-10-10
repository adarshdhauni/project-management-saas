const getUserInitials = (name) => {
  return (name ?? "")
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default getUserInitials;
