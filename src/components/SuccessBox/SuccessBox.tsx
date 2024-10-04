// Used on the Signup and Reset Password Page to show a Success Message after Submitting

import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import Button from "../Button/Button";
import { Text } from "../Typography/Typography";
import CheckboxIcon from "../Icons/Checkbox/CheckboxIcon";

type SuccessBoxProps = {
  title: string;
  description: string;
  footer?: React.ReactNode;
};

const SuccessBox: FC<SuccessBoxProps> = ({
  title,
  description,
  footer = <></>,
}) => {
  return (
    <Stack
      p="40px 36px"
      border="1px solid #E5E7EB"
      borderRadius="12px"
      gap="32px"
    >
      <CheckboxIcon />
      <Stack gap="8px">
        <Typography
          fontWeight="700"
          fontSize="36px"
          lineHeight="44px"
          letterSpacing="-0.02em"
          color="#111827"
        >
          {title}
        </Typography>
        <Text size="large" weight="regular" color="#6B7280">
          {description}
        </Text>
      </Stack>

      <Stack gap="20px">
        <Button
          href="/signin"
          variant="contained"
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: 600,
          }}
        >
          Log In
        </Button>
        {footer}
      </Stack>
    </Stack>
  );
};

export default SuccessBox;
