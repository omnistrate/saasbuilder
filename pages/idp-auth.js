import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Buffer } from "buffer";
import { customerSignInWithIdentityProvider } from "src/api/customer-user";
import axios from "src/axios";
import Cookies from "js-cookie";
import { Stack } from "@mui/material";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import useSnackbar from "src/hooks/useSnackbar";

function IDPAuth() {
  const router = useRouter();
  const { state, code } = router.query;
  const isRouterReady = router.isReady;
  const snackbar = useSnackbar();

  useEffect(() => {
    if (isRouterReady) {
      if (state && code) {
        const decodedAuthStateString = Buffer.from(state, "base64").toString(
          "utf8"
        );
        try {
          const authState = JSON.parse(decodedAuthStateString);

          //get local auth state from session storage and compare the nonce values
          const localAuthStateString = sessionStorage.getItem("authState");
          //decode from base64 to utf8 string
          const decodedLocalAuthStateString = Buffer.from(
            localAuthStateString,
            "base64"
          ).toString("utf8");

          const localAuthState = JSON.parse(decodedLocalAuthStateString);

          if (localAuthState.nonce === authState.nonce) {
            const identityProvider = localAuthState.identityProvider;
            const invitationInfo = localAuthState.invitationInfo || {};

            const payload = {
              authorizationCode: code,
              identityProviderName: identityProvider,
              ...invitationInfo,
            };

            handleSignIn(payload);
          }
        } catch (error) {
          console.log(error);
          router.replace("/signin?redirect_reason=idp_auth_error");
        }
      } else {
        router.replace("/signin");
      }
    }
  }, [state, code, isRouterReady]);

  async function handleSignIn(payload) {
    try {
      const response = await customerSignInWithIdentityProvider(payload);
      const jwtToken = response.data.jwtToken;
      sessionStorage.removeItem("authState");
      if (jwtToken) {
        Cookies.set("token", jwtToken, { sameSite: "Strict", secure: true });
        axios.defaults.headers["Authorization"] = "Bearer " + jwtToken;
        router.replace("/service-plans");
      }
    } catch (error) {
      sessionStorage.removeItem("authState");
      if (error.response && error.response.status === 409) {
        snackbar.showError(
          `This email is already registered. You may reset your password or contact support for help`
        );
        router.replace("/signup");
      } else {
        router.replace("/signin?redirect_reason=idp_auth_error");
      }
    }
  }

  return (
    <Stack
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <LoadingSpinner />
    </Stack>
  );
}

export default IDPAuth;
