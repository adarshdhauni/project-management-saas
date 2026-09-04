const focusField = (id) => {
  const element = document.getElementById(id);

  element?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  element?.focus();
};

export default focusField;
