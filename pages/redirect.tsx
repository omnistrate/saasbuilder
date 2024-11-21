import RedirectPage from "src/features/RedirectPage/RedirectPage";

import { getProviderOrgDetails } from "src/server/api/customer-user";

export const getServerSideProps = async () => {
  let orgName = "";
  let orgLogoURL = "";
  try {
    const response = await getProviderOrgDetails();
    orgName = response.data.orgName;
    orgLogoURL = response.data.orgLogoURL;
  } catch (err) {}

  return {
    props: {
      orgName: orgName,
      orgLogoURL: orgLogoURL,
    },
  };
};

export default RedirectPage;
