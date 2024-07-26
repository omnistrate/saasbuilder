import { Box, Stack, styled } from "@mui/material";
import { Text } from "src/components/Typography/Typography";
import Link from "next/link";
import ChevronRightIcon from "src/components/Icons/ChevronRight/ChevronRightIcon";
import { FC } from "react";

const StyledLink = styled(Link)({
  textDecoration: "underline",
  color: "#7F56D9",
  fontWeight: 500,
});

type StyledBulletTextWithLinkProps = {
  text: string;
  link: string;
  linkText?: string;
};

const StyledBulletTextWithLink: FC<StyledBulletTextWithLinkProps> = (props) => {
  const { text, link, linkText = "Click here" } = props;

  return (
    <Stack direction={"row"} alignItems={"center"} mt={"6px"} gap="4px">
      <ChevronRightIcon />

      <Text size="small" weight="regular" color="#6f7174">
        {text}{" "}
        <StyledLink href={link} target="_blank" rel="noopener noreferrer">
          {linkText}
        </StyledLink>
      </Text>
    </Stack>
  );
};

type DescriptionProps = {};

export const AWSAccountIDDescription: FC<DescriptionProps> = (props) => {
  return (
    <Box>
      <StyledBulletTextWithLink
        text="Don't have AWS Account?"
        link={"https://signin.aws.amazon.com/signup?request_type=register"}
      />

      <StyledBulletTextWithLink
        text="Can't find AWS Account ID?"
        link={
          "https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html#ViewYourAWSId"
        }
      />
    </Box>
  );
};

export const GCPProjectIDDescription: FC<DescriptionProps> = (props) => {
  return (
    <Box>
      <StyledBulletTextWithLink
        text="Don't have GCP Account?"
        link={"https://cloud.google.com/"}
      />

      <StyledBulletTextWithLink
        text="Can't find GCP Project ID?"
        link={
          "https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects"
        }
      />
    </Box>
  );
};

export const GCPProjectNumberDescription: FC<DescriptionProps> = (props) => {
  return (
    <Box>
      <StyledBulletTextWithLink
        text="Can't find GCP Project Number?"
        link={
          "https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects"
        }
      />
    </Box>
  );
};
