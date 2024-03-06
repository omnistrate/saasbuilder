import ChangePasswordPage from "src/features/ChangePassword/ChangePasswordPage";
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

export default ChangePasswordPage;
