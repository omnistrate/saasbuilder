import { Box } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

const GradientProgressBar = ({ percentage = 0, marginTop = "16px" }) => {
  const [triangleColor, setTriangleColor] = useState("#f00"); // Initial color

  const updateTriangleColor = useCallback(() => {
    const gradient =
      "linear-gradient(270deg, #0c9622 7.76%, #eecb15 44.22%, #ee8b15 94.82%)";
    const color = calculateColor(gradient, 100 - percentage);
    setTriangleColor(color);
  }, [percentage]);

  useEffect(() => {
    window.addEventListener("resize", updateTriangleColor);
    updateTriangleColor();

    return () => {
      window.removeEventListener("resize", updateTriangleColor);
    };
  }, [percentage, updateTriangleColor]);

  return (
    <Box
      sx={{
        position: "relative",
        marginTop,
        width: "100%",
        maxWidth: "100px",
        height: "8px",
        background:
          "linear-gradient(270deg, #0c9622 7.76%, #eecb15 44.22%, #ee8b15 94.82%)",
        borderRadius: "20px",
      }}
    >
      <Box
        className="triangle"
        sx={{
          position: "absolute",
          top: "-6px",
          left: getLeftposition(percentage) + "%",
          transform: "translateX(-50%)",
          borderStyle: "solid",
          borderWidth: "0 8px 8px 8px",
          borderColor: `transparent transparent ${triangleColor} transparent`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "-24px",
          left: getLeftposition(percentage) + "%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "18px",
          color: "#000000",
        }}
      >
        {Math.floor(percentage)}%
      </Box>
    </Box>
  );
};

export default GradientProgressBar;

function getLeftposition(percentage) {
  if (percentage <= 8) {
    return 8;
  } else if (percentage >= 92) {
    return 92;
  } else {
    return percentage;
  }
}

function interpolateColor(color1, color2, factor) {
  const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);

  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function calculateColor(gradient, percentage) {
  const match = gradient.match(/#[0-9a-fA-F]+/g);

  if (match && match.length >= 3) {
    const color1 = match[0];
    const color2 = match[1];
    const color3 = match[2];

    let interpolatedColor;
    if (percentage <= 44.22) {
      interpolatedColor = interpolateColor(color1, color2, percentage / 44.22);
    } else {
      interpolatedColor = interpolateColor(
        color2,
        color3,
        (percentage - 44.22) / (94.82 - 44.22)
      );
    }

    return interpolatedColor;
  }
  return "#f00"; // Default color if calculation fails
}
