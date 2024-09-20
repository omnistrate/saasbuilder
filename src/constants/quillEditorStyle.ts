import { styleConfig } from "src/providerConfig";

export const quillEditorStyle = {
  "& a": {
    color: styleConfig.primaryColor,
    textDecoration: "underline",
  },
  "& .ql-align-justify": {
    textAlign: "justify",
  },
  "& .ql-align-center": {
    textAlign: "center",
  },
  "& .ql-align-right": {
    textAlign: "right",
  },
};
