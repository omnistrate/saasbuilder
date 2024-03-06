import { styled } from "@mui/material";

const variantTypes = {
  desktop: "desktop",
  mobile: "mobile",
};

const weightTypes = {
  medium: "medium",
  regular: "regular",
  semibold: "semibold",
  bold: "bold",
  extrabold: "extrabold",
};

export const weights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

const shouldForwardProp = (prop) => {
  return (prop !== prop) !== "variant" && prop !== "weight";
};

export const H3 = styled("h3", {
  shouldForwardProp,
})(({ theme, variant = variantTypes.desktop, weight = weightTypes.bold }) => ({
  fontSize: variant === variantTypes.desktop ? 32 : 28,
  lineHeight: variant === variantTypes.desktop ? 40 : 36,
  fontWeight: weights[weight],
}));

export const H5 = styled("h5", {
  shouldForwardProp,
})(({ theme, variant = variantTypes.desktop, weight = weightTypes.bold }) => ({
  fontSize: variant === variantTypes.desktop ? 24 : 20,
  lineHeight: variant === variantTypes.desktop ? "32px" : "28px",
  fontWeight: weights[weight],
}));

export const H6 = styled("h6", {
  shouldForwardProp,
})(({ theme, variant = variantTypes.desktop, weight = weightTypes.bold }) => ({
  fontSize: variant === variantTypes.desktop ? 20 : 18,
  lineHeight: variant === variantTypes.desktop ? "28px" : "24px",
  fontWeight: weights[weight],
}));

const paragraphSizeTypes = {
  large: "large",
  medium: "medium",
  small: "small",
  xsmall: "xsmall",
};

const paragraphAndTextSizes = {
  large: {
    fontSize: "18px",
    lineHeight: "28px",
  },
  medium: {
    fontSize: "16px",
    lineHeight: "24px",
  },
  small: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  xsmall: {
    fontSize: "12px",
    lineHeight: "18px",
  },
};

const paragraphSizes = {
  ...paragraphAndTextSizes,
};

export const textStyles = {
  ...paragraphAndTextSizes,
};

const paragraphWeightTypes = {
  regular: "regular",
  medium: "medium",
  semibold: "semibold",
};
const paragraphWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
};

export const P = styled("p", {
  shouldForwardProp: (prop) => prop !== "size" && prop !== "weight",
})(
  ({
    theme,
    size = paragraphSizeTypes.medium,
    weight = paragraphWeightTypes.medium,
  }) => ({
    ...paragraphSizes[size],
    fontWeight: paragraphWeights[weight],
  })
);

const displayTextSizeTypes = {
  xsmall: "xsmall",
  small: "small",
  large: "large",
  medium: "medium",
  xlarge: "xlarge",
};

const displayTextSizes = {
  [displayTextSizeTypes.xsmall]: {
    fontSize: 24,
    lineHeight: "32px",
  },
  [displayTextSizeTypes.small]: {
    fontSize: 30,
    lineHeight: "38px",
  },
  [displayTextSizeTypes.medium]: {
    fontSize: 36,
    lineHeight: "44px",
  },
  [displayTextSizeTypes.large]: {
    fontSize: 48,
    lineHeight: "60px",
  },
  [displayTextSizeTypes.xlarge]: {
    fontSize: "60px",
    lineHeight: "72px",
  },
};

export const DisplayText = styled("h2", {
  shouldForwardProp: (prop) =>
    !["size", "weight", "sx", "color", "mt", "mb", "pt", "pb"].includes(prop),
})(
  ({
    theme,
    size = displayTextSizeTypes.small,
    weight = weightTypes.semibold,
    color = "black",
    mt = 0,
    mb = 0,
    pt = 0,
    pb = 0,
  }) => ({
    ...displayTextSizes[size],
    fontWeight: weights[weight],
    wordBreak: "break-all",
  })
);

const textStyleTypes = {
  large: "large",
  medium: "medium",
};

const styles = {
  xlarge: {
    fontSize: "20px",
    lineHeight: "30px",
  },
  large: {
    fontSize: "18px",
    lineHeight: "28px",
  },
  medium: {
    fontSize: "16px",
    lineHeight: "24px",
  },
  small: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  xsmall: {
    fontSize: "12px",
    lineHeight: "20px",
  },
  heading: {
    fontSize: "22px",
    lineHeight: "22px",
  },
};

export const Text = styled("p", {
  shouldForwardProp: (prop) =>
    ![
      "size",
      "weight",
      "sx",
      "color",
      "mt",
      "mb",
      "pt",
      "pb",
      "ml",
      "mr",
    ].includes(prop),
})(({
  size = styles.large,
  weight = weightTypes.semibold,
  color = "#101828",
  mt = 0,
  mb = 0,
  pt = 0,
  pb = 0,
  ml = 0,
  mr = 0,
}) => {
  let marginTop = "0px";
  if (typeof mt === "number") {
    marginTop = mt * 8;
  }
  if (typeof mt === "string") {
    marginTop = mt;
  }

  let marginLeft = "0px";
  if (typeof ml === "number") {
    marginLeft = ml * 8;
  }
  if (typeof mt === "string") {
    marginLeft = ml;
  }

  return {
    ...styles[size],
    fontWeight: weights[weight],
    color: color,
    marginTop: marginTop,
    marginLeft: marginLeft,
    // mb: mb,
    // pt: pt,
    // pb: pb,
  };
});
