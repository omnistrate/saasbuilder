import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { Stack, Typography } from "@mui/material";
import * as Yup from "yup";
import { customerUserSignup } from "src/api/customer-user";
import MainImageLayout from "components/NonDashboardComponents/Layout/MainImageLayout";
import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import SubmitButton from "components/NonDashboardComponents/FormElementsV2/SubmitButton";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import PasswordField from "components/NonDashboardComponents/FormElementsV2/PasswordField";
import SignupNotification from "components/NonDashboardComponents/SignupNotification";
import useSnackbar from "src/hooks/useSnackbar";
import { passwordRegex, passwordText } from "src/utils/passwordRegex";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";

const signupValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(passwordRegex, passwordText),
  confirmPassword: Yup.string()
    .required("Re-enter your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  legalcompanyname: Yup.string().required("Company name is required"),
});

const SignupPage = (props) => {
  const { orgName, orgLogoURL } = props;
  const router = useRouter();
  const { org, orgUrl, email, userSource } = router.query;
  const [showSuccess, setShowSuccess] = useState(false);
  const snackbar = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      legalcompanyname: "",
      companydescription: "",
      companyurl: "",
      userSource: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      let data = {};

      for (let key in values) {
        if (values[key]) {
          data[key] = values[key];
        }
      }

      signupMutation.mutate(data);
    },
    validationSchema: signupValidationSchema,
  });

  const signupMutation = useMutation(
    (payload) => {
      setShowSuccess(false);
      return customerUserSignup(payload);
    },
    {
      onSuccess: (data) => {
        formik.resetForm();
        setShowSuccess(true);
      },
      onError: (error) => {
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          snackbar.showError(errorMessage);
        }
      },
    }
  );

  useEffect(() => {
    const updatedValues = {};

    if (org) {
      updatedValues.legalcompanyname = decodeURIComponent(org);
    }
    if (orgUrl) {
      updatedValues.companyurl = orgUrl;
    }
    if (email) {
      updatedValues.email = decodeURIComponent(email);
    }
    if (userSource) {
      updatedValues.userSource = userSource;
    }

    formik.setValues((values) => ({
      ...values,
      ...updatedValues,
    }));

    if (org && orgUrl && email) {
      const readOnlyFields = ["legalcompanyname", "companyurl", "email"];

      readOnlyFields.forEach((fieldName) => {
        const field = document.querySelector(`[name=${fieldName}]`);
        if (field) {
          field.setAttribute("readonly", true);
        }
      });
    }
  }, [org, orgUrl, email]);

  const { values, touched, errors, handleChange, handleBlur } = formik;

  return (
    <>
      <SignupNotification isVisible={showSuccess} />
      <MainImageLayout
        orgName={orgName}
        orgLogoURL={orgLogoURL}
        pageTitle="Sign up"
      >
        <DisplayHeading>Get Started Today</DisplayHeading>

        <Stack component="form" gap="32px" autoComplete="off">
          {/* Signup Form */}
          <Stack gap="10px">
            <FieldContainer>
              <FieldLabel required>Name</FieldLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.name && errors.name}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Email</FieldLabel>
              <TextField
                name="email"
                id="email"
                placeholder="example@companyemail.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                disabled={email ? true : false}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.email && errors.email}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Company Name</FieldLabel>
              <TextField
                id="legalcompanyname"
                name="legalcompanyname"
                placeholder="Enter your company's name"
                value={values.legalcompanyname}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={org ? true : false}
                error={touched.legalcompanyname && errors.legalcompanyname}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.legalcompanyname && errors.legalcompanyname}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>Company URL</FieldLabel>
              <TextField
                id="companyurl"
                name="companyurl"
                placeholder="https://companyurl.com"
                value={values.companyurl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.companyurl && errors.companyurl}
                disabled={orgUrl ? true : false}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.companyurl && errors.companyurl}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Password</FieldLabel>
              <PasswordField
                name="password"
                id="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.password && errors.password}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Confirm Password</FieldLabel>
              <PasswordField
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.confirmPassword && errors.confirmPassword}
              </FieldError>
            </FieldContainer>
          </Stack>

          <Typography
            fontWeight="500"
            fontSize="14px"
            lineHeight="22px"
            color="#A0AEC0"
            textAlign="start"
          >
            By creating an account, you agree to the{" "}
            <Link
              target="_blank"
              href="/terms-of-use"
              style={{ color: "#27A376" }}
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              target="_blank"
              href="/privacy-policy"
              style={{ color: "#27A376" }}
            >
              Privacy Policy
            </Link>
            .
          </Typography>

          {/* Login and Google Button */}
          <Stack gap="16px">
            <SubmitButton
              type="submit"
              onClick={formik.handleSubmit}
              disabled={!formik.isValid}
              loading={signupMutation.isLoading}
            >
              Create Account
            </SubmitButton>
          </Stack>
        </Stack>
        {/* Signup Link */}
        <Typography
          fontWeight="500"
          fontSize="14px"
          lineHeight="22px"
          color="#A0AEC0"
          textAlign="center"
        >
          Already have an account?{" "}
          <Link href="/signin" style={{ color: "#27A376" }}>
            Login here
          </Link>
        </Typography>
      </MainImageLayout>
    </>
  );
};

export default SignupPage;
