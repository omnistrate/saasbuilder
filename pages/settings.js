import SettingsMarketplace from "src/features/ProfileSettings/SettingsMarketplace";

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

export default SettingsMarketplace;
