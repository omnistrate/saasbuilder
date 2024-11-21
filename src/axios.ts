import Axios from "axios";
import Cookies from "js-cookie";

const baseDomain =
  process.env.NEXT_PUBLIC_BACKEND_BASE_DOMAIN || "https://api.omnistrate.cloud";

export const baseURL = baseDomain + "/2022-09-01-00";

const axios = Axios.create({
  baseURL,
  headers: {
    Authorization: "Bearer " + Cookies.get("token"),
  },
  ignoreGlobalErrorSnack: false,
});

export default axios;

declare module "axios" {
  export interface AxiosRequestConfig {
    ignoreGlobalErrorSnack?: boolean;
  }
}
