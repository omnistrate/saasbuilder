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
import countriesAlpha3 from "../constants/alpha3-countries";
import Autocomplete from "src/components/FormElementsv2/AutoComplete/AutoComplete";
import { useMemo } from "react";

function ProfileForm(props) {
  const { refetch, selectUser = {} } = props;
  const snackbar = useSnackbar();

  const updateProfileMutation = useMutation((data) => {
    return updateProfile(selectUser?.id, data)
      .then(() => {
        /*eslint-disable-next-line no-use-before-define*/
        formik.resetForm();
        refetch();
        snackbar.showSuccess("Updated Billing Address Successfully!");
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
      address: {
        addressLine1: selectUser.address?.addressLine1 || "",
        addressLine2: selectUser.address?.addressLine2 || "",
        city: selectUser.address?.city || "",
        country: selectUser.address?.country || "",
        state: selectUser.address?.state || "",
        zip: selectUser.address?.zip || "",
      },
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
      address: Yup.object().shape({
        addressLine1: Yup.string().required("Address Line 1 is required"),
        addressLine2: Yup.string(),
        city: Yup.string().required("City is required"),
        country: Yup.string().required("Country is required"),
        state: Yup.string().required("State is required"),
        zip: Yup.string().required("Zipcode is required"),
      }),
    }),
  });

  const currentCountry = useMemo(() => {
    const alpha3Code = formik.values.address.country;

    if (alpha3Code) {
      const match = countriesAlpha3.find(
        (country) =>
          country["alpha-3"].toLowerCase() === alpha3Code.toLowerCase()
      );
      return match;
    }
    return null;
  }, [formik.values.address.country]);

  const { values, handleChange, handleBlur, touched, errors } = formik;

  return (
    <>
      <Form onSubmit={formik.handleSubmit} sx={{ marginBottom: "20px" }}>
        <Text size="large" weight="semibold" mt="24px">
          Billing Address
        </Text>
        <Text size="small" weight="regular">
          Update your billing address
        </Text>
        <Divider sx={{ mt: 2.5 }} />

        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>Address Line 1</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="address.addressLine1"
                  id="address.addressLine1"
                  value={values.address.addressLine1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                  disabled={selectUser.roleType !== "root"}
                />
                <ErrorLabel>
                  {touched.address?.addressLine1 &&
                    errors.address?.addressLine1}
                </ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel>Address Line 2</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="address.addressLine2"
                  id="address.addressLine2"
                  value={values.address.addressLine2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                  disabled={selectUser.roleType !== "root"}
                />
                <ErrorLabel>
                  {touched.address?.addressLine2 &&
                    errors.address?.addressLine2}
                </ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>City</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="address.city"
                  id="address.city"
                  value={values.address.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                  disabled={selectUser.roleType !== "root"}
                />
                <ErrorLabel>
                  {touched.address?.city && errors.address?.city}
                </ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>State</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="address.state"
                  id="address.state"
                  value={values.address.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                />
                <ErrorLabel>
                  {touched.address?.state && errors.address?.state}
                </ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>Country</FieldLabel>
              </TableCell>
              <TableCell>
                <Autocomplete
                  options={countriesAlpha3}
                  value={currentCountry}
                  getOptionLabel={(option) => {
                    if (option.name) return option.name;
                    return "Select a country";
                  }}
                  onChange={(e, newValue) => {
                    formik.setFieldValue(
                      "address.country",
                      newValue?.["alpha-3"]?.toLowerCase()
                    );
                  }}
                  // onBlur={(e) => {
                  //   formik.setFieldTouched("address.country", true);
                  // }}
                  placeholder="Select a country"
                />
                <ErrorLabel>
                  {touched.address?.country && errors.address?.country}
                </ErrorLabel>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "312px !important" }}>
                <FieldLabel required>Zipcode</FieldLabel>
              </TableCell>
              <TableCell>
                <TextField
                  name="address.zip"
                  id="address.zip"
                  value={values.address.zip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  mt="12px"
                  disabled={selectUser.roleType !== "root"}
                />
                <ErrorLabel>
                  {touched.address?.zip && errors.address?.zip}
                </ErrorLabel>
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
