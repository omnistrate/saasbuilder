import MarketplaceProductTier from "src/features/Marketplace/MarketplaceProductTier/MarketplaceProductTier";

import { getProviderOrgDetails } from "src/server/api/customer-user";

export const getServerSideProps = async () => {
  const response = await getProviderOrgDetails();

  return {
    props: {
      orgName: response.data.orgName,
      orgLogoURL: response.data.orgLogoURL,
    },
  };
};

export default MarketplaceProductTier;
