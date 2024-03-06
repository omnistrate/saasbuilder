import { styled } from "@mui/material";
import Image from "next/image";
import calendarIcon from "../../../public/assets/images/dashboard/calendar.png";

const StyledImg = styled(Image)({
  height: 40,
  width: 40,
  display: "inline-block",
});

const CalendarIcon = () => {
  return <StyledImg src={calendarIcon} alt={"calendar-icon"} />;
};

export default CalendarIcon;
