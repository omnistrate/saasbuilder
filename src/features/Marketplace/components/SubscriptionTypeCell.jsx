import { Stack } from "@mui/material";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";

const SubscriptionTypeCell = ({ subscriptionType }) => {
  return (
    <Stack direction="row" gap="10px" alignItems="center">
      {subscriptionType === "Direct" ? (
        <SubscriptionTypeDirectIcon />
      ) : (
        <SubscriptionTypeInvitedIcon />
      )}
      {subscriptionType}
    </Stack>
  );
};

export default SubscriptionTypeCell;
