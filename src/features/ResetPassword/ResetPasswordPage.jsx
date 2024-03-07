import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSnackbar from "src/hooks/useSnackbar";
import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import PageDescription from "components/NonDashboardComponents/PageDescription";
import SubmitButton from "components/NonDashboardComponents/FormElementsV2/SubmitButton";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import CenterContentLayout from "components/NonDashboardComponents/Layout/CenterContentLayout";
import { customerUserResetPassword } from "src/api/customer-user";

const resetPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPasswordPage = (props) => {
  const { orgName, orgLogoURL } = props;
  const snackbar = useSnackbar();

  const resetPasswordMutation = useMutation(
    (payload) => {
      return customerUserResetPassword(payload);
    },
    {
      onSuccess: (data) => {
        formik.resetForm();
        snackbar.showSuccess(
          "Reset password link sent to the registered email"
        );
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      let data = {};

      for (let key in values) {
        if (values[key]) {
          data[key] = values[key];
        }
      }

      resetPasswordMutation.mutate(data);
    },
    validationSchema: resetPasswordValidationSchema,
  });

  const { values, touched, errors, handleChange, handleBlur } = formik;

  return (
    <CenterContentLayout
      orgName={orgName}
      orgLogoURL={orgLogoURL}
      showLogo
      pageTitle="Reset Password"
    >
      <Stack gap="16px">
        <DisplayHeading>Reset your password</DisplayHeading>
        <PageDescription>
          Enter your email address and we’ll send you password reset
          instructions.
        </PageDescription>
      </Stack>
      <FieldContainer>
        <FieldLabel required>Registered Email</FieldLabel>
        <TextField
          name="email"
          id="email"
          placeholder="Input your registered email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          helperText={touched.email && errors.email}
        />
      </FieldContainer>
      <SubmitButton
        type="submit"
        onClick={formik.handleSubmit}
        disabled={!formik.isValid}
        loading={resetPasswordMutation.isLoading}
      >
        Submit
      </SubmitButton>
    </CenterContentLayout>
  );
};

export default ResetPasswordPage;
