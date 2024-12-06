import * as React from "react";
// import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "../Button/Button";
import FieldContainer from "../FormElements/FieldContainer/FieldContainer";
import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import FieldDescription from "../FormElements/FieldDescription/FieldDescription";
import TextField from "../FormElements/TextField/TextField";
import Form from "../FormElements/Form/Form";
import { Box, styled } from "@mui/material";
import Image from "next/image";
import environmentIcon from "../../../public/assets/images/dashboard/service/environment.png";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import DeprecateIcon from "../Icons/DeprecateIcon/DeprecateIcon";

export default function ConfirmationDialog(props) {
  // const [open, setOpen] = React.useState(false);
  const {
    open = false,
    handleClose,
    variant = "confirm",
    formData,
    title,
    subtitle,
    message,
    buttonLabel,
    buttonColour,
    isLoading,
    icon,
  } = props;

  const isTypeDelete = variant === "delete";

  return (
    // <FormBody>
    <Dialog
      style={{ padding: "20px", borderRadius: "10px" }}
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      minWidth="xl"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Form onSubmit={formData.handleSubmit}>
        <DialogTitle>
          <Box display="flex">
            {icon === "deprecateIcon" ? (
              <Box
                sx={{
                  marginRight: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#FEE4E2",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <DeprecateIcon />
              </Box>
            ) : (
              <Icon
                style={{
                  display: "inlineBlock",
                  verticalAlign: "middle",
                  marginRight: "10px",
                }}
                src={icon ? icon : environmentIcon}
                alt="environment-icon"
              />
            )}
            <Box sx={{ marginTop: "auto", marginBottom: "auto" }}>
              {" "}
              {title}{" "}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <FieldContainer>
            <FieldLabel sx={{ mt: "5px", fontSize: "16px" }}>
              {subtitle}
            </FieldLabel>
            <FieldDescription
              dangerouslySetInnerHTML={{ __html: message }}
              sx={{ mt: "5px", fontSize: "16px" }}
            />
            <TextField
              id="deleteme"
              name="deleteme"
              value={formData.values.deleteme}
              onChange={formData.handleChange}
              onBlur={formData.handleBlur}
              sx={{ marginTop: "16px" }}
            />
          </FieldContainer>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              minWidth: "100px",

              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              borderShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              height: "40px !important",
              padding: "10px 14px !important",
            }}
            style={{ color: "black" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{
              minWidth: "100px",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              backgroundColor: isTypeDelete ? "#cf4027" : "",
              borderShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              height: "40px !important",
              padding: "10px 14px !important",
            }}
            type="submit"
            variant="contained"
            bgColor={buttonColour}
            // disabled={isDeleteEnable}
            disabled={isLoading}
          >
            {buttonLabel} {isLoading && <LoadingSpinnerSmall />}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
    // </FormBody>
  );
}

const Icon = styled(Image)(({}) => ({
  height: 48,
  width: 48,
}));
