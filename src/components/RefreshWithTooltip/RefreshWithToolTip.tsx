import { IconButton } from "@mui/material";
import Tooltip from "../Tooltip/Tooltip";
import RefreshIcon from "../Icons/Refresh/Refresh";

interface RefreshWithToolTipProps {
  refetch: () => void;
  disabled: boolean;
  isVisible?: boolean;
}

const RefreshWithToolTip: React.FC<RefreshWithToolTipProps> = (props) => {
  const { refetch, disabled, isVisible = true } = props;

  return (
    <Tooltip placement="top" title="Refresh" isVisible={isVisible}>
      <IconButton size="small" disabled={disabled} onClick={refetch}>
        <RefreshIcon disabled={disabled} />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshWithToolTip;
