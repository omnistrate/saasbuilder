import { Box, Divider, styled } from "@mui/material";
import Image from "next/image";

const Title = styled("h6")({
  fontWeight: 600,
  fontSize: "30px",
  lineHeight: "38px",
  margin: 0,
  marginLeft: 10,
});

const Icon = styled(Image)(({}) => ({
  height: 48,
  width: 48,
}));

const Description = styled("p")(({ theme }) => ({
  color: theme.palette.neutral[500],
  fontSize: 16,
  lineHeight: "24px",
  marginLeft: 10,
  marginTop: "4px",
}));


function LogoHeader(props) {
  const { newicon, desc, title, margin = "22px" } = props;

  return (
    <>
      <Box
        display="flex"
        flexDirection="colunm"
        alignItems="center"
        margin={margin}
        justifyContent="flex-start"
      >
        {newicon && <Icon src={newicon} alt="image-icon" />}

        <Box display="block" justifyContent="flex-start" alignItems="center">
          <Title>{title}</Title>
          <Description>{desc}</Description>
        </Box>
      </Box>

      <Divider />
    </>
  );
}

export default LogoHeader;

