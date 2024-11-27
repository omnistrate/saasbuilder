import { FC } from "react";
import Select from "../FormElementsv2/Select/Select";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import MenuItem from "../FormElementsv2/MenuItem/MenuItem";
import { SelectChangeEvent } from "@mui/material";
import { useRouter } from "next/router";

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

  const subscriptions = subscriptionsQuery.data || [];
  const isLoadingSubscriptions = subscriptionsQuery.isLoading;

  const selectedSubscription = subscriptions.find(
    (subscription) => subscription.id === subscriptionId
  );

  function handleChange(e: SelectChangeEvent) {
    const newSubscriptionId = e.target.value;
  }

  return (
    <Select value={subscriptionId} onChange={handleChange}>
      {subscriptions.map((subscription) => {
        return (
          <MenuItem value={subscription.id} key={subscription.id}>
            {subscription.productTierName}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default SubscriptionsDropdown;
