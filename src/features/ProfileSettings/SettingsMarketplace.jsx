import React, { useEffect } from "react";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import { selectUserrootData } from "src/slices/userDataSlice";
import useUserData from "src/hooks/usersData";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import PasswordForm from "./components/PasswordForm";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import UserInfoBanner from "./components/UserInfoBanner";
import ProfileForm from "./components/ProfileForm";
import { tabs } from "./constants";
import BillingAddress from "./components/BillingAddress";

function SettingsMarketplace({ orgLogoURL, orgName }) {
  const router = useRouter();
  const { view } = router.query;
  const selectUser = useSelector(selectUserrootData);
  const { query, refetch } = useUserData();
  const [currentTab, setCurrentTab] = React.useState("Profile");

  useEffect(() => {
    if (router.isReady) {
      if (view) {
        setCurrentTab(view);
      }
    }
  }, [router.isReady, view]);

  return (
    <DashboardLayout
      sx={{ padding: 0 }}
      noSidebar
      marketplacePage
      serviceLogoURL={orgLogoURL}
      serviceName={orgName}
    >
      {query.isRefetching === true || query.isLoading === true ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserInfoBanner
            selectUser={selectUser}
            currentTab={currentTab}
            router={router}
          />
          {currentTab === tabs.profile && (
            <ProfileForm refetch={refetch} selectUser={selectUser} />
          )}
          {currentTab === tabs.password && <PasswordForm />}
          {currentTab === tabs.billingAddress && (
            <BillingAddress refetch={refetch} selectUser={selectUser} />
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default SettingsMarketplace;
