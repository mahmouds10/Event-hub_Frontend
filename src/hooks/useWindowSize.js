import { useState, useEffect } from "react";

export const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth]);
  
    useEffect(() => {
      const handleResize = () => {
        setSize([window.innerWidth]);
      };
  
      const debouncedResize = debounce(handleResize, 100);
  
      window.addEventListener("resize", debouncedResize);
      return () => window.removeEventListener("resize", debouncedResize);
    }, []);
  
    return size;
  };
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  