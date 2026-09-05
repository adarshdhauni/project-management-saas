import { useEffect, useState } from "react";

const HEADER_OFFSET = 64;

const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = [...document.querySelectorAll("section[id]")];

    if (!sections.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + HEADER_OFFSET + 1;

      let currentSection = "";

      for (const section of sections) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        if (sectionTop <= scrollPosition) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return activeSection;
};

export default useActiveSection;
