import { getProviderOrgDetails } from "src/server/api/customer-user";
import BillingPage from "src/features/Billing/BillingPage";
import Head from "next/head";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import NoLogoImage from "public/assets/images/logos/no-logo.png";

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

export default function Billing({ orgLogoURL, orgName }) {
  return (
    <DashboardLayout
      sx={{ padding: 0 }}
      noSidebar
      marketplacePage
      serviceLogoURL={orgLogoURL || NoLogoImage}
      serviceName={orgName}
    >
      <Head>
        <title>Billing</title>
      </Head>
      <BillingPage orgLogoURL={orgLogoURL} orgName={orgName} />
    </DashboardLayout>
  );
}
