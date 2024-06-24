import React from "react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../Dialog/InformationDialogTopCenter";
import { Box, CircularProgress, Stack } from "@mui/material";
import RestoreBackupModalHeaderIcon from "../Icons/RestoreInstance/RestoreBackupModalHeaderIcon";
import { Text } from "../Typography/Typography";
import Button from "../Button/Button";
import RestoreInstanceDateTime from "./RestoreInstanceDateTime";

function RestoreInstanceFormStep({
  restoreMutation,
  restoreFormik,
  handleClose,
}) {
  return (
    <>
      <DialogHeader>
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap="8px"
        >
          <Box sx={{ flexShrink: 0 }}>
            <RestoreBackupModalHeaderIcon />
          </Box>
          <Box>
            <Text size="medium">Restore Your Instance from a Backup</Text>
            <Text size="small" weight="normal" color="#475467">
              Create a new resource instance from a specific point in time
              backup
            </Text>
          </Box>
        </Stack>
      </DialogHeader>
      <DialogContent>
        <RestoreInstanceDateTime formData={restoreFormik} />
      </DialogContent>
      <DialogFooter>
        <Button
          variant="outlined"
          disabled={restoreMutation.isLoaing}
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={restoreMutation.isLoading || !restoreFormik.isValid}
          onClick={restoreFormik.handleSubmit}
        >
          Restore
          {restoreMutation.isLoading && (
            <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default RestoreInstanceFormStep;
