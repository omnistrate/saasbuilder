import { styled } from "@mui/material";
import Image from "next/image";
import regionIcon from "../../../public/assets/images/dashboard/region.svg";

const StyledImg = styled(Image)({
  height: 40,
  width: 40,
  display: "inline-block",
});

const RegionIcon = () => {
  return <StyledImg src={regionIcon} alt={"region-icon"} />;
};

export default RegionIcon;
