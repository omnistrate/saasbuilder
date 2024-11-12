import { Box } from "@mui/material";
import React from "react";

import SwaggerUI from "swagger-ui-react";

import "swagger-ui-react/swagger-ui.css";

export default function SwaggerDocs(props) {
  const { data } = props;
  // const [swaggerUILoading, setSwaggerUILoading] = React.useState(true);

  // const onComp = (c)=>{
  //   setSwaggerUILoading(false);
  // }

  return (
    <Box sx={{ marginTop: "17px" }}>
      {/* {swaggerUILoading && ( <LoadingSpinner />)} */}
      <SwaggerUI spec={data} />
    </Box>
  );
}
