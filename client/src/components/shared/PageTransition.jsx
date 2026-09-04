import { useLocation } from "react-router-dom";

const PageTransition = ({ children, className = "" }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;
