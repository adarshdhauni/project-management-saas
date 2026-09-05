import { useEffect, useState } from "react";

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "-35% 0px -50% 0px",
  threshold: 0,
};

const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = [...document.querySelectorAll("section[id]")];

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0].target.id);
      }
    }, OBSERVER_OPTIONS);

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return activeSection;
};

export default useActiveSection;
