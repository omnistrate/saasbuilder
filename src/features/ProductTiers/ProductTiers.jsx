import { Box, Stack, Typography, styled } from "@mui/material";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import Card from "src/components/Card/Card";
import marketplaceIcon from "public/assets/images/dashboard/marketplace.svg";
import SingleProductTierPlanCard from "./components/SingleProductTierPlanCard";
import MultiProductTierPlanCard from "./components/MultiProductTierPlanCard";
import { useSelector } from "react-redux";
import { selectUserrootData } from "src/slices/userDataSlice";
import { useMutation } from "@tanstack/react-query";
import { createSubscriptions, deleteSubscription } from "src/api/subscriptions";
import { useFormik } from "formik";
import TextConfirmationDialog from "src/components/TextConfirmationDialog/TextConfirmationDialog";
import { getResourceRoute } from "src/utils/route/access/accessRoute";
import useSnackbar from "src/hooks/useSnackbar";
import { findSubscriptionByPriority } from "src/utils/access/findSubscription";
import { useRouter } from "next/router";
import MarketplaceServiceDefinitionsTab, {
  tabs,
} from "./components/MarketplaceServiceDefinitionsTab";
import ProductTierPlanDetailsCard from "./components/ProductTierPlanDetailsCard";
import NoProductTierUI from "src/components/NoProductTierUI/NoProductTierUI";

function ProductTiers(props) {
  const {
    source,
    serviceId,
    environmentId,
    serviceOfferingData,
    subscriptionsData,
    refetchSubscriptions,
  } = props;

  const router = useRouter();
  const currentUser = useSelector(selectUserrootData);

  const [selectedProductTierId, setSelectedProductTierId] = useState("");
  const selectedProductTier = serviceOfferingData?.offerings?.find(
    (item) => item?.productTierID === selectedProductTierId
  );
  const [currentTab, setCurrentTab] = useState(tabs.description);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const snackbar = useSnackbar();

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    deleteFormik.resetForm();
    setIsDeleteDialogOpen(false);
  };

  const isUserFromServiceOrg =
    currentUser?.orgId === serviceOfferingData?.serviceOrgId;


  const subscribeMutation = useMutation(createSubscriptions, {
    onSuccess: async () => {
      await refetchSubscriptions();
      snackbar.showSuccess("Product Tier subscribed successfully!.");
    },
  });

  const unSubscribeMutation = useMutation(deleteSubscription, {
    onSuccess: async () => {
      await refetchSubscriptions();
      snackbar.showSuccess("Product Tier unsubscribed.");
      handleDeleteDialogClose();
    },
  });

  const deleteFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: (values) => {
      if (values.confirmationText === "unsubscribe") {
        const rootSubscription = findSubscriptionByPriority(
          subscriptionsData,
          serviceId,
          selectedProductTierId
        );
        unSubscribeMutation.mutate(rootSubscription?.id);
      } else {
        snackbar.showError("Please enter unsubscribe");
      }
    },
    validateOnChange: false,
  });

  useEffect(() => {
    if (serviceOfferingData?.offerings?.length) {
      setSelectedProductTierId(
        serviceOfferingData?.offerings[0]?.productTierID
      );
    }
  }, [serviceOfferingData]);

  if (!serviceOfferingData?.offerings?.length && environmentId) {
    if (source === "access") return <NoProductTierUI />;
    return (
      <Card style={{ height: "700px", width: "100%" }}>
        <Box>
          <Image
            style={{ height: "500px", width: "100%", marginTop: "50px" }}
            src={marketplaceIcon}
            alt="image-icon"
          />
          <Box mt="-300px">
            <div
              justifyContent="center"
              align="center"
              style={{
                marginTop: "50px",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              No Product Tiers
            </div>
            <div
              justifyContent="center"
              align="center"
              style={{
                marginTop: "5px",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              available
            </div>
          </Box>
        </Box>
      </Card>
    );
  }

  const handleNavigateToDashboard = () => {
    const subscription = findSubscriptionByPriority(
      subscriptionsData,
      serviceId,
      selectedProductTierId
    );

    const getRoute = getResourceRoute(
      serviceId,
      environmentId,
      selectedProductTierId,
      source,
      subscription?.id
    );

    if (source === "access") {
      window.open(getRoute);
    } else {
      router.push(getRoute);
    }
  };

  return (
    <Box>
      <Stack justifyContent="center">
        <ProductTiersHeading>Product Tier Plans</ProductTiersHeading>
      </Stack>

      <Box marginTop={"30px"}>
        {serviceOfferingData?.offerings?.length === 1 ? (
          serviceOfferingData?.offerings?.map((offering, i) => (
            <Fragment key={i}>
              <SingleProductTierPlanCard
                offering={offering}
                serviceId={serviceId}
                subscriptionsData={subscriptionsData}
                selectedProductTierId={selectedProductTierId}
                setSelectedProductTierId={setSelectedProductTierId}
                source={source}
                isUserFromServiceOrg={isUserFromServiceOrg}
                subscribeMutation={subscribeMutation}
                unSubscribeMutation={unSubscribeMutation}
                handleNavigateToDashboard={handleNavigateToDashboard}
                handleUnsubscribeClick={handleDeleteDialogOpen}
                isMarketplacePage={true}
              />
            </Fragment>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: "30px",
              marginRight: "auto",
              marginLeft: "auto",
              justifyContent: "center",
            }}
          >
            {serviceOfferingData?.offerings?.map((offering, i) => (
              <Fragment key={i}>
                <MultiProductTierPlanCard
                  offering={offering}
                  serviceId={serviceId}
                  subscriptionsData={subscriptionsData}
                  selectedProductTierId={selectedProductTierId}
                  setSelectedProductTierId={setSelectedProductTierId}
                  source={source}
                  isUserFromServiceOrg={isUserFromServiceOrg}
                  subscribeMutation={subscribeMutation}
                  unSubscribeMutation={unSubscribeMutation}
                  handleNavigateToDashboard={handleNavigateToDashboard}
                  handleUnsubscribeClick={handleDeleteDialogOpen}
                  isMarketplacePage={true}            
                />
              </Fragment>
            ))}
          </Box>
        )}
      </Box>

      <Box mt="20px">
        <MarketplaceServiceDefinitionsTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </Box>
      <Box sx={{ minHeight: "400px" }}>
        {currentTab === tabs.description && (
          <ProductTierPlanDetailsCard
            name={currentTab}
            description={selectedProductTier?.productTierDescription}
          />
        )}
        {currentTab === tabs.documentation && (
          <ProductTierPlanDetailsCard
            name={currentTab}
            description={selectedProductTier?.productTierDocumentation}
          />
        )}
        {currentTab === tabs.pricing && (
          <ProductTierPlanDetailsCard
            name={currentTab}
            description={selectedProductTier?.productTierPricing?.value}
          />
        )}
        {currentTab === tabs.support && (
          <ProductTierPlanDetailsCard
            name={currentTab}
            description={selectedProductTier?.productTierSupport}
          />
        )}
      </Box>

      <TextConfirmationDialog
        formData={deleteFormik}
        open={isDeleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        title="Unsubscribe Product Tier "
        subtitle={`Are you sure you want to unsubscribe ?`}
        message={
          "To confirm unsubscribe Service, please enter <b> unsubscribe </b>, in the field below:"
        }
        isLoading={unSubscribeMutation.isLoading}
        buttonLabel={"Confirm"}
      />
    </Box>
  );
}

export default ProductTiers;

export const ProductTiersHeading = styled(Typography)(() => ({
  color: "#3F4254",
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "34px",
  letterSpacing: "-0.72px",
}));
