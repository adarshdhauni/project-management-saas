import React from "react";

const PublicFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-7 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© 2026 TaskFlow. All rights reserved.</span>

        <div className="flex gap-5">
          <a
            href="#"
            className="transition-colors hover:text-primary-foreground"
          >
            Privacy
          </a>

          <a
            href="#"
            className="transition-colors hover:text-primary-foreground"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
