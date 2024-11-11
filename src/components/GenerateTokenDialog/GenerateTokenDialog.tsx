import Button from "../Button/Button";
import CopyButton from "../Button/CopyButton";
import TextField from "../FormElementsv2/TextField/TextField";
import CloseIcon from "../Icons/Close/CloseIcon";
import GenerateTokenIcon from "../Icons/GenerateToken/GenerateTokenIcon";
import { Text } from "../Typography/Typography";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import useToken from "./useToken";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";

const GenerateTokenDialog = ({
  open,
  onClose,
  selectedInstanceId,
  subscriptionId,
}) => {
  const { data: tokenData, isFetching: isFetchingTokenData } = useToken(
    {
      instanceId: selectedInstanceId,
      subscriptionId,
    },
    {
      enabled: Boolean(open && selectedInstanceId && subscriptionId),
    }
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: "12px",
          minWidth: "400px",
          maxWidth: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          pt: "24px",
          pb: "16px",
          position: "relative",
        }}
      >
        <Box
          width="48px"
          height="48px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid #E4E7EC"
          borderRadius="10px"
          boxShadow="0px 1px 2px 0px #1018280D"
        >
          <GenerateTokenIcon />
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "16px",
            top: "16px",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: "32px" }}>
        <Text
          size="large"
          weight="semibold"
          color="#101828"
          sx={{ mb: "20px" }}
        >
          Generate Token
        </Text>
        {isFetchingTokenData ? (
          <Box
            height="110px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <LoadingSpinnerSmall />
          </Box>
        ) : (
          <>
            <Stack direction="row" alignItems="center" gap="12px" mb="24px">
              <TextField disabled value={tokenData?.token} />
              <CopyButton
                text={tokenData?.token || ""}
                iconProps={{
                  width: "20px",
                  height: "20px",
                }}
              />
            </Stack>
            <Text size="small" weight="regular" color="#475467">
              Please make sure to copy the token and store it securely, you
              won&apos;t be able to view it again
            </Text>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: "24px", borderTop: "1px solid #E4E7EC" }}>
        <Button variant="contained" onClick={onClose} sx={{ width: "100%" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateTokenDialog;
