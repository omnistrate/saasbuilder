import {
  Box,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { Text } from "components/Typography/Typography";
import Form from "components/FormElements/Form/Form";
import FieldLabel from "components/FormElements/FieldLabel/FieldLabel";
import TextField from "components/FormElements/TextField/TextField";
import Button from "components/Button/Button";
import ErrorLabel from "components/ErrorLabel/ErrorLabel";
import useSnackbar from "src/hooks/useSnackbar";
import { updateProfile } from "src/api/users";

function ProfileForm(props) {
  const { refetch, selectUser = {} } = props;
  const snackbar = useSnackbar();

  const updateProfileMutation = useMutation((data) => {
    return updateProfile(selectUser?.id, data)
      .then(() => {
        /*eslint-disable-next-line no-use-before-define*/
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
      orgName: selectUser.orgName,
      orgDescription: selectUser.orgDescription,
      orgURL: selectUser.orgURL,
      orgId: selectUser.orgId,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // Remove Empty Fields
      for (const key in values) {
        if (!values[key]) {
          delete values[key];
        }
      }

      updateProfileMutation.mutate(values);
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      orgName: Yup.string().required("Org Name is required"),
      orgDescription: Yup.string(),
      orgURL: Yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]{1,3})*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Please enter a valid URL"
      ),
    }),
  });

  const { values, handleChange, handleBlur, touched, errors } = formik;

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

      <Divider sx={{ mt: 2.5 }} />

      <Form onSubmit={formik.handleSubmit}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>Name</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                />
                <ErrorLabel>{touched.name && errors.name}</ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>Organization ID</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  readonly
                  disabled
                  value={values.orgId}
                  mt="12px"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>Organization Name</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="orgName"
                  id="orgName"
                  placeholder="Organization Name"
                  value={values.orgName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                  disabled={selectUser.roleType !== "root"}
                />
                <ErrorLabel>{touched.orgName && errors.orgName}</ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel>Organization Website URL</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="orgURL"
                  id="orgURL"
                  placeholder="Organization Website URL"
                  value={values.orgURL}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                  disabled={selectUser.roleType !== "root"}
                />
                <ErrorLabel>{touched.orgURL && errors.orgURL}</ErrorLabel>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box display="flex" alignItems="center" mt="20px">
          <Header2 align="right">
            <Button
              variant="contained"
              sx={{
                marginLeft: "30px",
                marginTop: "16px",
                marginRight: "20px",
              }}
              type="submit"
              disabled={updateProfileMutation.isLoading || !formik.dirty}
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
