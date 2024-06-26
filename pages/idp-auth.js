import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Buffer } from "buffer";
import { customerSignInWithIdentityProvider } from "src/api/customer-user";
import axios from "src/axios";
import Cookies from "js-cookie";
import { Stack } from "@mui/material";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";

function IDPAuth() {
  const router = useRouter();
  const { state, code } = router.query;
  const isRouterReady = router.isReady;

  useEffect(() => {
    if (isRouterReady) {
      if (state && code) {
        const decodedAuthStateString = Buffer.from(state, "base64").toString(
          "utf8"
        );
        try {
          const authState = JSON.parse(decodedAuthStateString);

          //get local auth state from local storage and compare the nonce values
          const localAuthStateString = localStorage.getItem("authState");
          const localAuthState = JSON.parse(localAuthStateString);
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
    const response = await customerSignInWithIdentityProvider(payload);
    const jwtToken = response.data.jwtToken;
    localStorage.removeItem("authState");
    if (jwtToken) {
      Cookies.set("token", jwtToken, { sameSite: "Strict", secure: true });
      axios.defaults.headers["Authorization"] = "Bearer " + jwtToken;
      router.replace("/service-plans");
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
