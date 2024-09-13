import { FC, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import DataGrid from "components/DataGrid/DataGrid";
import SideDrawerRight from "components/SideDrawerRight/SideDrawerRight";
import DataGridText from "components/DataGrid/DataGridText";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import useSnackbar from "src/hooks/useSnackbar";
import { CustomNetwork } from "src/types/customNetwork";
import useCustomNetworks from "./hooks/useCustomNetworks";
import { deleteCustomNetwork } from "src/api/customNetworks";
import CustomNetworkForm from "./components/CreateCustomNetworkForm";
import CustomNetworkDataGridHeader from "./components/CustomNetworkDataDridHeader";
import TextConfirmationDialog from "src/components/TextConfirmationDialog/TextConfirmationDialog";
import useCloudProviderRegions from "src/hooks/query/useCloudProviderRegions";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import RegionIcon from "src/components/Region/RegionIcon";
import { CloudProvider } from "src/types/common/enums";

type CustomNetworkProps = {
  cloudProviders: CloudProvider[];
  //array of supported aws, gcp region codes
  supportedAWSRegions: string[];
  supportedGCPRegions: string[];
  serviceId: string;
  productTierId: string;
};

const CustomNetworks: FC<CustomNetworkProps> = (props) => {
  const {
    cloudProviders = [],
    supportedAWSRegions,
    supportedGCPRegions,
    serviceId,
    productTierId,
  } = props;
  const snackbar = useSnackbar();
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [selectedCustomNetwork, setSelectedCustomNetwork] =
    useState<CustomNetwork | null>(null);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);

  const cloudProviderRegionsQuery = useCloudProviderRegions(
    serviceId,
    productTierId,
    cloudProviders
  );

  const { data: cloudProviderRegions = [] } = cloudProviderRegionsQuery;

  const {
    data: customNetworks = [],
    isFetching: isFetchingCustomNetworks,
    isLoading: isLoadingCustomNetworks,
    refetch: refetchCustomNetworks,
  } = useCustomNetworks();

  const filteredCustomNetworks = useMemo(() => {
    let filtered = customNetworks;

    filtered = customNetworks.filter((customNetwork) => {
      const cloudProvider = customNetwork.cloudProviderName;
      const region = customNetwork.cloudProviderRegion;

      const belongsToSupportedCloudProvider = cloudProviders.includes(
        customNetwork.cloudProviderName
      );

      let belongsToSupportedRegion = false;

      if (cloudProvider === "aws") {
        belongsToSupportedRegion = supportedAWSRegions.includes(region);
      } else if (cloudProvider === "gcp") {
        belongsToSupportedRegion = supportedGCPRegions.includes(region);
      }

      return belongsToSupportedCloudProvider && belongsToSupportedRegion;
    });

    return filtered;
  }, [
    customNetworks,
    cloudProviders,
    supportedAWSRegions,
    supportedGCPRegions,
  ]);

  const openSideDrawer = () => {
    setIsSideDrawerOpen(true);
  };

  const closeSideDrawer = () => {
    setSelectedCustomNetwork(null);
    setIsSideDrawerOpen(false);
  };

  const deleteCustomNetworkMutation = useMutation(
    (data: CustomNetwork) => {
      const { id } = data;
      return deleteCustomNetwork(id);
    },
    {
      onSuccess: async () => {
        refetchCustomNetworks();
        closeSideDrawer();
        setShowDeleteConfirmationDialog(false);
        /*eslint-disable-next-line no-use-before-define*/
        deleteformik.resetForm();
        snackbar.showSuccess("Custom Network deleted");
      },
    }
  );

  const deleteformik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: (values) => {
      if (values.confirmationText === "deleteme") {
        deleteCustomNetworkMutation.mutate(selectedCustomNetwork);
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 170,
        headerAlign: "center",
        align: "center",
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.name,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => (
          <DataGridText
            onClick={() => {
              setSelectedCustomNetwork(params.row);
              openSideDrawer();
            }}
            color="primary"
          >
            {params.row.name}
          </DataGridText>
        ),
      },
      {
        field: "cloudProviderName",
        headerName: "Provider",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.cloudProviderName,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => {
          const cloudProvider = params.row.cloudProviderName;

          return cloudProviderLogoMap[cloudProvider] || "-";
        },
      },
      {
        field: "cloudProviderRegion",
        headerName: "Region",
        flex: 1,
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.cloudProviderRegion,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => (
          <GridCellExpand
            value={params.row.cloudProviderRegion}
            startIcon={<RegionIcon />}
          />
        ),
      },
      {
        field: "cidr",
        headerName: "CIDR",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
        valueGetter: (params: GridCellParams<any, CustomNetwork>) =>
          params.row.cidr,
        renderCell: (params: GridCellParams<any, CustomNetwork>) => (
          <DataGridText>{params.row.cidr}</DataGridText>
        ),
      },
    ],
    []
  );

  if (isLoadingCustomNetworks) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Box mt="20px">
        <DataGrid
          disableColumnMenu
          hideFooterSelectedRowCount
          disableSelectionOnClick
          components={{
            Header: CustomNetworkDataGridHeader,
          }}
          componentsProps={{
            header: {
              count: filteredCustomNetworks.length,
              openSideDrawer,
              refetchCustomNetworks,
              isFetchingCustomNetworks,
            },
          }}
          columns={columns}
          rows={isFetchingCustomNetworks ? [] : filteredCustomNetworks}
          getRowId={(row: CustomNetwork) => row.id}
          loading={isFetchingCustomNetworks}
          noRowsText="No custom networks"
        />
      </Box>

      <SideDrawerRight
        size={"medium"}
        open={isSideDrawerOpen}
        closeDrawer={closeSideDrawer}
        RenderUI={
          <>
            <CustomNetworkForm
              refetchCustomNetworks={refetchCustomNetworks}
              selectedCustomNetwork={selectedCustomNetwork}
              closeDrawer={closeSideDrawer}
              onDelete={() => {
                setShowDeleteConfirmationDialog(true);
              }}
              cloudProviders={cloudProviders}
              cloudProviderRegions={cloudProviderRegions}
              supportedAWSRegions={supportedAWSRegions}
              supportedGCPRegions={supportedGCPRegions}
            />
          </>
        }
      />

      <TextConfirmationDialog
        open={showDeleteConfirmationDialog}
        handleClose={() => {
          setShowDeleteConfirmationDialog(false);
          deleteformik.resetForm();
        }}
        formData={deleteformik}
        title={`Delete Custom Network`}
        buttonLabel={"Delete"}
        buttonColour={"red"}
        subtitle={`Are you sure you want to delete this custom network?`}
        message={
          "To confirm deletion, please enter <b>deleteme</b>, in the field below:"
        }
        isLoading={deleteCustomNetworkMutation.isLoading}
        isDeleteEnable={true}
      />
    </>
  );
};

export default CustomNetworks;
