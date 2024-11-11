import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { FC } from "react";
import Accordian from "src/components/Accordian/Accordian";
import AccordionKeyValueCopyTable from "src/components/AccordionKeyValueCopyTable/AccordionKeyValueCopyTable";
import Button from "src/components/Button/Button";
import Divider from "src/components/Divider/Divider";
import InfoIcon from "src/components/Icons/Info/Info";
import { Text } from "src/components/Typography/Typography";

type CustomDNSDetailsModalProps = {
  open: boolean;
  handleClose: () => void;
  aRecordTarget?: string;
  cnameTarget?: string;
  domainName: string;
};

const CustomDNSDetailsModal: FC<CustomDNSDetailsModalProps> = (props) => {
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
        <Accordian
          disableToggle
          title={title}
          description="Apply these settings in your DNS provider’s system"
        >
          <AccordionKeyValueCopyTable rows={rows} />
        </Accordian>
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
