import Axios from "axios";
//omnistrate backend base url
import { baseURL } from "src/axios";

const axios = Axios.create({
  baseURL: baseURL,
});

const defaultErrorMessage = "";

export default async function handleDownloadCLI(nextRequest, nextResponse) {
  axios.defaults.headers["Authorization"] = nextRequest.headers.authorization;

  const { serviceId, serviceApiId, subscriptionId } = nextRequest.query;

  try {
    const response = await axios.get(
      `/service/${serviceId}/service-api/${serviceApiId}/cli`,
      {
        responseType: "blob",
        params: {
          subscriptionId,
        },
      }
    );
    //console.log("Download CLI response", response);

    const data = response.data;
    const responseStatusCode = response.status;
    console.log("Download CLI Response status", responseStatusCode);
    nextResponse.status(200);

    return nextResponse
      .setHeader("content-type", response.headers["content-type"])
      .send(data);
  } catch (error) {
    console.log("Download CLI error", error);
    const errorCode = error?.response?.status || 500;
    const errorMessage = error?.response?.data?.message || defaultErrorMessage;
    nextResponse.status(errorCode).send({
      message: errorMessage,
    });
  }

  //respond with 500 by default
  nextResponse.status(500).send({ message: defaultErrorMessage });
}
