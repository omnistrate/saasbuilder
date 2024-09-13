import React, { useEffect, useRef, useState } from "react";
import { Text } from "../Typography/Typography";

function EllipsisTooltipText({ text, sx, ...restProps }) {
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

  return (
    <Text
      sx={{
        width: "100%",
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...(sx ? sx : {}),
      }}
      {...restProps}
      ref={textElementRef}
      {...(hasEllipsis ? { title: text } : {})}
    >
      {text}
    </Text>
  );
}

export default EllipsisTooltipText;
