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
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";

const resetPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPasswordPage = (props) => {
  const { orgName, orgLogoURL, googleReCaptchaSiteKey, isReCaptchaSetup } =
    props;
  const snackbar = useSnackbar();
  const reCaptchaRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasCaptchaErrored, setHasCaptchaErrored] = useState(false);

  const resetPasswordMutation = useMutation(
    (payload) => {
      return customerUserResetPassword(payload);
    },
    {
      onSuccess: () => {
        /*eslint-disable-next-line no-use-before-define*/
        formik.resetForm();
        snackbar.showSuccess(
          "If an account associated with this email exists, you will be sent a link to reset your password"
        );
      },
      onError: (error) => {
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          snackbar.showError(errorMessage);
        }
      },
    }
  );

  async function handleFormSubmit(values) {
    const data = {};

    if (reCaptchaRef.current && !hasCaptchaErrored) {
      const token = await reCaptchaRef.current.executeAsync();
      reCaptchaRef.current.reset();
      data["reCaptchaToken"] = token;
    }

    for (const key in values) {
      if (values[key]) {
        data[key] = values[key];
      }
    }
    resetPasswordMutation.mutate(data);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
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
        disabled={!formik.isValid || (isReCaptchaSetup && !isScriptLoaded)}
        loading={resetPasswordMutation.isLoading}
      >
        Submit
      </SubmitButton>
      {isReCaptchaSetup && (
        <ReCAPTCHA
          size="invisible"
          sitekey={googleReCaptchaSiteKey}
          ref={reCaptchaRef}
          asyncScriptOnLoad={() => {
            setIsScriptLoaded(true);
          }}
          onErrored={() => {
            setHasCaptchaErrored(true);
          }}
        />
      )}
    </CenterContentLayout>
  );
};

export default ResetPasswordPage;
