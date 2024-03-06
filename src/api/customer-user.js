import axios from "axios";

export function customerUserSignup(payload) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/signup`,
    payload
  );
}

export function customerUserSignin(payload) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/signin`,
    payload
  );
}

export function customerUserResetPassword(payload) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/reset-password`,
    payload
  );
}

export function getProviderOrgDetails() {
  return axios.get(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/provider-details`
  );
}
