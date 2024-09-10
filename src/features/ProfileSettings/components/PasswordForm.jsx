import React from "react";
import { Box, CircularProgress, Divider } from "@mui/material";
import { Text } from "src/components/Typography/Typography";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSnackbar from "src/hooks/useSnackbar";
import Form from "src/components/FormElements/Form/Form";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import styled from "@emotion/styled";
import Button from "src/components/Button/Button";
import { updatePassword } from "src/api/users";
import useLogout from "src/hooks/useLogout";
import { passwordRegex, passwordText } from "src/utils/passwordRegex";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";
import { PasswordField } from "src/components/FormElementsv2/PasswordField/PasswordField";

function ChangePassword() {
  const snackbar = useSnackbar();
  const { logout } = useLogout();

  const createChangePasswordMutation = useMutation(
    (values) => {
      const payload = {
        password: values.password,
        currentPassword: values.currentPassword,
      };
      return updatePassword(payload);
    },
    {
      onSuccess: () => {
        snackbar.showSuccess("Updated password successfully!");
        /*eslint-disable-next-line no-use-before-define*/
        formik.resetForm();
        logout();
      },
      onError: (error) => {
        if (
          (error.response?.status === 500 || error.response?.status === 400) &&
          error.response?.data.message
        ) {
          const errorMessage = error.response?.data.message;
          snackbar.showError(errorMessage);
        }
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      const payload = {
        currentPassword: values.currentPassword,
        password: values.password,
      };
      createChangePasswordMutation.mutate(payload);
    },
    validateOnChange: false,
    //   validationSchema: createImageRegistryValidationSchema,
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current Password is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(passwordRegex, passwordText),
      confirmPassword: Yup.string()
        .required("Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
  });

  return (
    <Box sx={{ Padding: "100px" }}>
      <Box sx={{ marginBottom: "20px" }}>
        <Text size="large" weight="semibold">
          Password
        </Text>
        <Text size="small" weight="regular">
          Please enter your current password to change your password.
        </Text>
      </Box>

      <Divider sx={{ mt: 2.5, mb: 3 }} />
      <Form onSubmit={formik.handleSubmit}>
        <Box display="flex" alignItems="center" mt="20px">
          <FieldLabel required>Current Password</FieldLabel>
          <Box marginLeft="150px">
            <PasswordField
              required
              name="currentPassword"
              id="currentPassword"
              placeholder="Current Password*"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.currentPassword && formik.errors.currentPassword
              }
              sx={{ marginTop: "12px", width: "600px" }}
            />
            <FieldError>
              {formik.touched.currentPassword && formik.errors.currentPassword}
            </FieldError>
          </Box>
        </Box>
        <Divider sx={{ mt: 2.5, mb: 2.5 }} />
        <Box display="flex" alignItems="center">
          <FieldLabel required>New Password</FieldLabel>
          <Box marginLeft="170px">
            <PasswordField
              required
              name="password"
              id="password"
              placeholder="New Password*"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
              sx={{ marginTop: "12px", width: "600px" }}
            />
            <FieldError>
              {formik.touched.password && formik.errors.password}
            </FieldError>
          </Box>
        </Box>
        <Divider sx={{ mt: 2.5, mb: 2.5 }} />
        <Box display="flex" alignItems="center">
          <FieldLabel required>Confirm New Password</FieldLabel>
          <Box marginLeft="110px">
            <PasswordField
              required
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm New Password*"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              sx={{ marginTop: "12px", width: "600px" }}
            />
            <FieldError>
              {formik.touched.confirmPassword && formik.errors.confirmPassword}
            </FieldError>
          </Box>
        </Box>
        <Divider sx={{ mt: 3, mb: 3 }} />
        <Box>
          <Header2 align="right">
            <Button
              variant="contained"
              sx={{
                marginLeft: "30px",
                marginTop: "16px",
                marginRight: "20px",
              }}
              type="submit"
              disabled={createChangePasswordMutation.isLoading}
            >
              Update Password
              {createChangePasswordMutation.isLoading && (
                <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
              )}
            </Button>
          </Header2>
        </Box>
      </Form>
    </Box>
  );
}

export default ChangePassword;

const Header2 = styled(Box)(() => ({
  width: "100%",
}));
