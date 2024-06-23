import { useState, useEffect } from "react";

export function Scroll(height) {
  const [isScrolled, setScrolled] = useState(false);
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > height);
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [height]);

  return isScrolled;
}
