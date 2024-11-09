import { styleConfig } from "src/providerConfig";
import Dot from "../../../Dot/Dot";

export default function SidebarDotIcon(props) {
  let color = styleConfig.sidebarIconActiveColor;
  if (props.active) {
    color = styleConfig.sidebarIconActiveColor;
  }

  return <Dot color={color} sx={{ flexShrink: "0" }} />;
}
