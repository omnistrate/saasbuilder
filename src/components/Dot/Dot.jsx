import { Box } from "@mui/material";

const Dot = (props) => {
  const { size = 6, color = "#12B76A", sx = {}, ...restProps } = props;
  return (
    <Box
      component="span"
      sx={{
        borderRadius: "50%",
        width: size,
        height: size,
        backgroundColor: color,
        ...sx,
      }}
      {...restProps}
    />
  );
};

export default Dot;
