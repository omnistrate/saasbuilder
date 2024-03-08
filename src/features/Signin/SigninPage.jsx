import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import crypto from "crypto-js";
import axios from "src/axios";
import Cookies from "js-cookie";
import * as Yup from "yup";
import MainImageLayout from "components/NonDashboardComponents/Layout/MainImageLayout";
import PageHeading from "components/NonDashboardComponents/PageHeading";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import SubmitButton from "components/NonDashboardComponents/FormElementsV2/SubmitButton";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import PasswordField from "components/NonDashboardComponents/FormElementsV2/PasswordField";
import { customerUserSignin } from "src/api/customer-user";
import useSnackbar from "src/hooks/useSnackbar";

const createSigninValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  hashedPassword: Yup.string().required("Password is required"),
});

const SigninPage = (props) => {
  const { orgName, orgLogoURL } = props;
  const router = useRouter();
  const snackbar = useSnackbar();
  const signInMutation = useMutation(
    (payload) => {
      delete axios.defaults.headers["Authorization"];
      return customerUserSignin(payload);
    },
    {
      onSuccess: (data) => {
        formik.resetForm();
        const jwtToken = data.data.jwtToken;
        if (jwtToken) {
          Cookies.set("token", jwtToken, { sameSite: "Strict", secure: true });
          axios.defaults.headers["Authorization"] = "Bearer " + jwtToken;
          router.push("/product-tiers");
        }
      },
      onError: (error) => {
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          snackbar.showError(errorMessage);
        } else {
          snackbar.showError(
            "Failed to sign in. Either the credentials are incorrect or the user does not exist"
          );
        }
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      hashedPassword: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      let data = {};

      for (let key in values) {
        if (values[key]) {
          data[key] = values[key];
          if (key === "hashedPassword") {
            data.hashedPassword = crypto
              .SHA256(values[key])
              .toString(crypto.enc.Hex);
          }
        }
      }
      signInMutation.mutate(data);
    },
    validationSchema: createSigninValidationSchema,
  });

  const { values, touched, errors, handleChange, handleBlur } = formik;

  return (
    <MainImageLayout
      pageTitle="Sign in"
      orgName={orgName}
      orgLogoURL={orgLogoURL}
    >
      <PageHeading>Login to your account</PageHeading>

      <Stack component="form" gap="32px">
        {/* Signin Form */}
        <Stack gap="30px">
          <FieldContainer>
            <FieldLabel required>Email Address</FieldLabel>
            <TextField
              name="email"
              id="email"
              placeholder="Enter your registered email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              helperText={touched.email && errors.email}
            />
          </FieldContainer>

          <FieldContainer>
            <FieldLabel required>Password</FieldLabel>
            <PasswordField
              name="hashedPassword"
              id="hashedPassword"
              placeholder="Enter your password"
              value={values.hashedPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.hashedPassword && errors.hashedPassword}
              helperText={touched.hashedPassword && errors.hashedPassword}
            />
          </FieldContainer>

          <Link
            href="/reset-password"
            style={{
              fontWeight: "500",
              fontSize: "14px",
              lineHeight: "22px",
              color: "#687588",
            }}
          >
            Forgot Password
          </Link>
        </Stack>

        {/* Login and Google Button */}
        <Stack gap="16px">
          <SubmitButton
            type="submit"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid}
            loading={signInMutation.isLoading}
          >
            Login
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
        You’re new in here?{" "}
        <Link href="/signup" style={{ color: "#27A376" }}>
          Create Account
        </Link>
      </Typography>
    </MainImageLayout>
  );
};

export default SigninPage;
