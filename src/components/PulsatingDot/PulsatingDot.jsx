import { Box } from "@mui/material";

export const PulsatingDot = (props) => {
  const {
    size = 6,
    color = "#12B76A",
    animationDuration = "500ms",
    animationTimingFunction = "ease-in-out",
    animationIterationCount = "infinite",
    animationDirection = "alternate",
    animationDelay = "500ms",
    animationName = "pulse",
    sx = {},
    ...restProps
  } = props;

  return (
    <Box
      sx={{
        borderRadius: "50%",
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 1,
        animationName,
        animationDuration,
        animationTimingFunction,
        animationIterationCount,
        animationDirection,
        animationDelay,
        "@keyframes pulse": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0.2,
          },
        },
        ...sx,
      }}
      {...restProps}
    />
  );
};
