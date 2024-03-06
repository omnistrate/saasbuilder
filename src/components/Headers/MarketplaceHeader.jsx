import { Box } from "@mui/material";
import { Text } from "../Typography/Typography";
import Chip from "../Chip/Chip";

function MarketplaceHeader(props) {
  const { isLoading, title, desc, count } = props;

  return (
    <Box borderBottom="1px solid #EAECF0" mb="20px">
      <Box display="flex" gap="8px" sx={{ marginBottom: "4px" }}>
        <Text size="large" weight="semibold">
          {title}
        </Text>
        {!isLoading && count ? <Chip label={count} /> : null}
      </Box>
      <Text size="small" weight="regular" sx={{ marginBottom: "10px" }}>
        {desc}
      </Text>
    </Box>
  );
}

export default MarketplaceHeader;
