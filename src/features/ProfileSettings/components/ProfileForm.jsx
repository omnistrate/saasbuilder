import {
  Box,
  CircularProgress,
  Table,
  TableCell,
  TableRow,
  styled,
} from "@mui/material";
import React from "react";
import { Text } from "src/components/Typography/Typography";
import Form from "src/components/FormElements/Form/Form";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import TextField from "src/components/FormElements/TextField/TextField";
import Button from "src/components/Button/Button";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import useSnackbar from "src/hooks/useSnackbar";
import { updateProfile } from "src/api/users";

function ProfileForm(props) {
  const { refetch, selectUser } = props;
  const snackbar = useSnackbar();

  const updateProfileMutation = useMutation((data) => {
    return updateProfile(selectUser?.id, data)
      .then((res) => {
        formik.resetForm();
        refetch();
        snackbar.showSuccess("Update Profile Successfully");
      })
      .catch((error) => {
        if (
          (error.response?.status === 500 || error.response?.status === 400) &&
          error.response?.data.message
        ) {
          const errorMessage = error.response?.data.message;
          snackbar.showError(errorMessage);
        }
      });
  });

  const formik = useFormik({
    initialValues: {
      name: selectUser.name,
      email: selectUser.email,
      orgName: selectUser.orgName,
      orgDescription: selectUser.orgDescription,
      orgURL: selectUser.orgURL,
      orgId: selectUser.orgId,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateProfileMutation.mutate(values);
    },
    validateOnChange: false,
  });
  return (
    <>
      <Box sx={{ marginBottom: "20px" }}>
        <Text size="large" weight="semibold">
          Personal info
        </Text>
        <Text size="small" weight="regular">
          Update your personal details here.
        </Text>
      </Box>
      <Form onSubmit={formik.handleSubmit}>
        <Table>
          <TableRow>
            <TableCell sx={{ width: "280px !important" }}>
              <FieldLabel required>Name</FieldLabel>
            </TableCell>
            <TableCell>
              <TextField
                name="name"
                required
                id="name"
                placeholder="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                mt="12px"
                sx={{ maxWidth: "800px !important" }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "280px !important" }}>
              <FieldLabel required>Organization ID</FieldLabel>
            </TableCell>
            <TableCell>
              <TextField
                readonly
                disabled
                value={formik.values.orgId}
                mt="12px"
                sx={{ maxWidth: "800px !important" }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "280px !important" }}>
              <FieldLabel required>Organization Name</FieldLabel>
            </TableCell>
            <TableCell>
              <TextField
                name="orgName"
                required
                id="orgName"
                placeholder="Organization Name"
                value={formik.values.orgName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                mt="12px"
                sx={{ maxWidth: "800px !important" }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "280px !important" }}>
              <FieldLabel required>Organization Website URL</FieldLabel>
            </TableCell>
            <TableCell>
              <TextField
                name="orgURL"
                required
                id="orgURL"
                placeholder="Organization Website URL"
                value={formik.values.orgURL}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                mt="12px"
                sx={{ maxWidth: "800px !important" }}
              />
            </TableCell>
          </TableRow>
        </Table>

        <Box display="flex" alignItems="center" mt="20px">
          <Box />
          <Header2 align="right">
            <Button
              variant="contained"
              sx={{
                marginLeft: "30px",
                marginTop: "16px",
                marginRight: "20px",
              }}
              type="submit"
              disabled={updateProfileMutation.isLoading}
            >
              Save
              {updateProfileMutation.isLoading && (
                <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
              )}
            </Button>
          </Header2>
        </Box>
      </Form>
    </>
  );
}

export default ProfileForm;

const Header2 = styled(Box)(() => ({
  width: "100%",
}));
