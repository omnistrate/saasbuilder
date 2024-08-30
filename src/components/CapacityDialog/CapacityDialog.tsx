import React, { FC } from "react";
import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import {
  addCapacityResourceInstanceAccess,
  removeCapacityResourceInstanceAccess,
} from "src/api/resourceInstance";
import useSnackbar from "src/hooks/useSnackbar";
import Button from "components/Button/Button";
import TextField from "components/FormElements/TextField/TextField";
import Form from "components/FormElements/Form/Form";
import { Text } from "../Typography/Typography";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import { AccessCapacityDataType, CapacityAction, ContextType } from "./enums";
import CapacityIcon from "../Icons/Capacity/CapacityIcon";

type CapacityDialogProps = {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
  data: AccessCapacityDataType;
  currentCapacityAction: CapacityAction;
  contextType?: ContextType;
};

const CapacityDialog: FC<CapacityDialogProps> = ({
  open,
  handleClose,
  data,
  currentCapacityAction,
  refetch,
}) => {
  const snackbar = useSnackbar();

  let labelObj = {
    title: "Remove Capacity",
    subtitle: "Number of Replicas to Remove",
    message:
      "Enter the number of replicas you want to remove from your capacity",
    buttonLabel: "Remove",
    successLabel: "removed",
  };
  if (currentCapacityAction === "add") {
    labelObj.title = "Add Capacity";
    labelObj.subtitle = "Number of Replicas to Add";
    labelObj.message =
      "Enter the number of replicas you want to add to your capacity";
    labelObj.buttonLabel = "Add";
    labelObj.successLabel = "added";
  }

  const capacityMutation = useMutation(
    async (payload: { count: number }) => {
      if (currentCapacityAction === "add") {
        return await addCapacityResourceInstanceAccess({
          count: payload.count,
          data: data as AccessCapacityDataType,
        });
      } else if (currentCapacityAction === "remove") {
        return await removeCapacityResourceInstanceAccess({
          count: payload.count,
          data: data as AccessCapacityDataType,
        });
      }
    },
    {
      onSuccess: () => {
        snackbar.showSuccess(`Capacity ${labelObj.successLabel} successfully`);
        capacityFormik.resetForm();
        handleClose();
        refetch();
      },
    }
  );

  const capacityFormik = useFormik({
    initialValues: {
      count: 1,
    },
    validationSchema: Yup.object({
      count: Yup.number()
        .required("Capacity count is required")
        .min(1, "Capacity count must be at least 1"),
      // .max(5, "Capacity count must be at gretered 5"),
    }),
    onSubmit: (values) => {
      capacityMutation.mutate(values);
    },
  });
  return (
    <Dialog data-cy="confirmation-dialog" open={open} onClose={handleClose}>
      {/* @ts-ignore */}
      <Form
        //@ts-ignore
        onSubmit={capacityFormik.handleSubmit}
      >
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap="16px">
              <CapacityIcon />
              <Text size="large" weight="bold">
                {labelObj.title}
              </Text>
            </Stack>
            <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {!!labelObj.subtitle && (
            <Text
              size="medium"
              weight="semibold"
              //@ts-ignore
              mt="20px"
            >
              {labelObj.subtitle}
            </Text>
          )}
          {!!labelObj.message && (
            <Text
              size="small"
              weight="medium"
              color="#344054"
              //@ts-ignore
              mt="9px"
            >
              {labelObj.message}
            </Text>
          )}
          <TextField
            //@ts-ignore
            id="count"
            name="count"
            type="number"
            value={capacityFormik.values.count}
            onChange={capacityFormik.handleChange}
            onBlur={capacityFormik.handleBlur}
            error={
              capacityFormik.touched.count &&
              Boolean(capacityFormik.errors.count)
            }
            helperText={
              capacityFormik.touched.count && capacityFormik.errors.count
            }
            sx={{
              marginTop: "16px",
              [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
                borderColor: "rgba(254, 228, 226, 1) !important",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            disabled={capacityMutation.isLoading}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="submit"
            variant="contained"
            disabled={capacityMutation.isLoading}
          >
            {labelObj.buttonLabel}
            {capacityMutation.isLoading && <LoadingSpinnerSmall />}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default CapacityDialog;

// Styled Components
const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "100%",
    maxWidth: "521px",
    padding: "24px",
  },
}));

const DialogTitle = styled(MuiDialogTitle)({
  padding: 0,
});

const DialogContent = styled(MuiDialogContent)({
  padding: 0,
});

const DialogActions = styled(MuiDialogActions)({
  padding: 0,
  paddingTop: 30,
});
