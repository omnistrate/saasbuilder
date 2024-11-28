import { FC } from "react";
import Select from "../FormElementsv2/Select/Select";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import MenuItem from "../FormElementsv2/MenuItem/MenuItem";
import { Box, SelectChangeEvent, Stack } from "@mui/material";
import { useRouter } from "next/router";
import SubscriptionTypeDirectIcon from "../Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import { Text } from "../Typography/Typography";
import { Subscription } from "src/types/subscription";
import Chip from "../Chip/Chip";
import SubscriptionTypeInvitedIcon from "../Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import Tooltip from "../Tooltip/Tooltip";

type SubscriptionDropdownProps = {
  serviceId: string;
  subscriptionId: string;
};

const SubscriptionsDropdown: FC<SubscriptionDropdownProps> = (props) => {
  const { serviceId, subscriptionId } = props;
  const router = useRouter();
  const { environmentId } = router.query;

  const environmentType = useEnvironmentType();
  const subscriptionsQuery = useUserSubscriptions(
    {
      serviceId: serviceId,
      environmentType,
    },
    {
      refetchOnMount: false,
    }
  );

  const subscriptions: Subscription[] = subscriptionsQuery.data || [];
  const isLoadingSubscriptions = subscriptionsQuery.isLoading;

  const selectedSubscription: Subscription | undefined = subscriptions.find(
    (subscription) => subscription.id === subscriptionId
  );

  function handleChange(e: SelectChangeEvent) {
    const newSubscriptionId = e.target.value;
  }

  return (
    <Select
      value={subscriptionId}
      onChange={handleChange}
      MenuProps={{
        PaperProps: {
          sx: {
            maxWidth: 247, // Set the max width for the menu
            padding: "11px 0px",
            borderRadius: "8px",
          },
        },
      }}
      renderValue={() => {
        return (
          <Stack direction="row" alignItems="center" gap="3px">
            <SubscriptionTypeDirectIcon
              style={{ flexShrink: 0 }}
              height={20}
              width={20}
            />
            <Text
              size="medium"
              weight="medium"
              color="#101828"
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {selectedSubscription?.productTierName}
            </Text>
          </Stack>
        );
      }}
    >
      {subscriptions.map((subscription) => {
        const SubscriptionTypeIcon = subscription.defaultSubscription
          ? SubscriptionTypeDirectIcon
          : SubscriptionTypeInvitedIcon;

        return (
          <MenuItem
            value={subscription.id}
            key={subscription.id}
            sx={{
              "& + &": {
                marginTop: "0px",
              },
              padding: "5px 12px",
            }}
          >
            <Tooltip
              title={subscription?.productTierName}
              placement="right"
              sx={{ marginLeft: "4px" }}
            >
              <Stack
                direction="row"
                alignItems="flexStart"
                gap="3px"
                width="100%"
              >
                <SubscriptionTypeIcon
                  style={{ flexShrink: 0, marginTop: "2px" }}
                  height={20}
                  width={20}
                />
                <Stack alignItems="flex-start" gap="6px">
                  <Text
                    size="medium"
                    weight="medium"
                    color="#101828"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    {subscription?.productTierName}
                  </Text>
                  <Chip
                    label={subscription.id}
                    fontColor="#067647"
                    bgColor="#ECFDF3"
                    borderColor="#ABEFC6"
                    size="small"
                  />
                </Stack>
              </Stack>
            </Tooltip>
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default SubscriptionsDropdown;
