import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import Accordion from "src/components/Accordion/Accordion";
import Button from "src/components/Button/Button";
import Divider from "src/components/Divider/Divider";
import InfoIcon from "src/components/Icons/Info/Info";
import KeyValueCopyTable from "src/components/KeyValueCopyTable/KeyValueCopyTable";
import { Text } from "src/components/Typography/Typography";

const CustomDNSDetailsModal = (props) => {
  const { open, handleClose, aRecordTarget, cnameTarget, domainName } = props;

  const rows = [
    {
      label: "Domain Name",
      value: domainName,
    },
    {
      label: cnameTarget ? "Target Endpoint" : "Target IP",
      value: cnameTarget ? cnameTarget : aRecordTarget,
    },
  ];

  const title = cnameTarget ? "CNAME" : "A Record";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      //@ts-ignore
      sx={{
        borderRadius: "12px",
        "& .MuiDialog-container": { alignItems: "start" },
      }}
      PaperProps={{
        sx: {
          margin: 0,
          width: "100%",
          maxWidth: "640px",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" gap="16px">
            <InfoIcon />
            <Box>
              <Text size="medium" weight="semibold" color="#344054">
                Alias Configuration
              </Text>
              <Text size="small" color="#475467" weight="normal">
                Configure your custom DNS settings
              </Text>
            </Box>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Accordion
          disableToggle
          title={title}
          description="Apply these settings in your DNS provider’s system"
        >
          <KeyValueCopyTable rows={rows} />
        </Accordion>
      </DialogContent>
      <Divider sx={{ marginTop: "12px" }} />
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button variant="contained" size="large" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDNSDetailsModal;
