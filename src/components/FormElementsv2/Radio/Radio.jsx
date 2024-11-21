import { styled } from "@mui/material";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";

const RadioUncheckedIcon = styled("span")(() => ({
  borderRadius: 8,
  border: "1px solid #D0D5DD",
  height: 16,
  width: 16,
  background: "#FFF",
}));

const RadioCheckedIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <rect width={15} height={15} x={0.5} y={0.5} fill="#F9F5FF" rx={7.5} />
    <rect width={15} height={15} x={0.5} y={0.5} stroke="#7F56D9" rx={7.5} />
    <circle cx={8} cy={8} r={3} fill="#7F56D9" />
  </svg>
);

export default function Radio(props) {
  return (
    <MuiRadio
      {...props}
      checkedIcon={<RadioCheckedIcon />}
      icon={<RadioUncheckedIcon />}
    />
  );
}

export const RadioGroup = styled(MuiRadioGroup)(() => ({
  marginTop: 6,
}));
