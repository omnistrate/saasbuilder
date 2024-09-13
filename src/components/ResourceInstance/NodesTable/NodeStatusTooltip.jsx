import { Box, Stack, Tooltip, tooltipClasses, styled } from "@mui/material";
import { Text } from "components/Typography/Typography";
import CircleCheckIcon from "components/Icons/CircleCheck/CircleCheckIcon";
import CircleCrossIcon from "components/Icons/CircleCross/CircleCrossIcon";

const NodeStatusTooltip = ({ detailedHealth, children }) => {
  const {
    ConnectivityStatus,
    DiskHealth,
    NodeHealth,
    ProcessHealth,
    ProcessLiveness,
  } = detailedHealth;

  const configurationList = [
    {
      text: "Connectivity Status",
      status: ConnectivityStatus,
    },
    {
      text: "Disk Health",
      status: DiskHealth,
    },
    {
      text: "Node Health",
      status: NodeHealth,
    },
    {
      text: "Process Health",
      status: ProcessHealth,
    },
    {
      text: "Process Liveness",
      status: ProcessLiveness,
    },
  ];

  return (
    <CustomTooltip
      disableFocusListener
      title={
        <>
          <Text
            size="xsmall"
            weight="semibold"
            color={"#32D583"}
            sx={{ mb: "8px" }}
          >
            Health Status
          </Text>
          {configurationList.map((item, index) => (
            <Stack key={index} direction="row" gap="12px">
              {item.status === "HEALTHY" ? (
                <CircleCheckIcon />
              ) : (
                <CircleCrossIcon
                  color={item.status === "UNHEALTHY" ? "#B42318" : "#808080"}
                />
              )}
              <Text size="small" weight="regular" color="#FFFFFF">
                {item.text}
              </Text>
            </Stack>
          ))}
        </>
      }
      arrow
    >
      <Box
        sx={{
          cursor: "pointer",
        }}
      >
        {children}
      </Box>
    </CustomTooltip>
  );
};

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#101828",
    padding: "12px",
    borderRadius: "8px",
    minWidth: "280px",
  },
});

export default NodeStatusTooltip;
