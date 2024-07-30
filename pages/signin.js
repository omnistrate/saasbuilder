import SigninPage from "src/features/Signin/SigninPage";
import { IDENTITY_PROVIDER_TYPES } from "src/features/Signin/constants";
import { getProviderOrgDetails } from "src/server/api/customer-user";
import { getIdentityProvidersList } from "src/server/api/identity-provider";
import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";

export const getServerSideProps = async () => {
  let orgName = "";
  let orgLogoURL = "";

  let googleIdentityProvider = null;
  let githubIdentityProvider = null;

  try {
    const promises = [];
    const orgDetailsPromise = getProviderOrgDetails().then((response) => {
      orgName = response.data.orgName;
      orgLogoURL = response.data.orgLogoURL;
    });
    promises.push(orgDetailsPromise);

    const identityProvidersPromise = getIdentityProvidersList().then(
      (response) => {
        const providers = response.data.identityProviders || [];
        const googleIDP = providers.find(
          (provider) =>
            provider.identityProviderName === IDENTITY_PROVIDER_TYPES.Google
        );
        if (googleIDP) {
          googleIdentityProvider = googleIDP;
        }

        const githubIDP = providers.find(
          (provider) =>
            provider.identityProviderName === IDENTITY_PROVIDER_TYPES.GitHub
        );
        if (githubIDP) {
          githubIdentityProvider = githubIDP;
        }
      }
    );
    promises.push(identityProvidersPromise);
    await Promise.all(promises);
  } catch (err) {}

  return {
    props: {
      orgName: orgName,
      orgLogoURL: orgLogoURL,
      googleIdentityProvider: googleIdentityProvider,
      githubIdentityProvider: githubIdentityProvider,
      saasBuilderBaseURL: getSaaSDomainURL(),
    },
  };
};

export default SigninPage;
