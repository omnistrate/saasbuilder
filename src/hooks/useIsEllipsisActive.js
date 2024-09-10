import { useEffect, useRef, useState } from "react";

function useIsEllipsisActive() {
  const textElementRef = useRef(null);
  const [hasEllipsis, setHasEllipsis] = useState(false);

  const compareSize = () => {
    if (textElementRef.current) {
      const compare =
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setHasEllipsis(compare);
    }
  };

  useEffect(() => {
    // compare once and add resize listener on "Mount"
    compareSize();
    window.addEventListener("resize", compareSize);
    // remove resize listener again on "unmount"

    return () => window.removeEventListener("resize", compareSize);
  }, [textElementRef]);

  return { hasEllipsis, textElementRef };
}

export default useIsEllipsisActive;
