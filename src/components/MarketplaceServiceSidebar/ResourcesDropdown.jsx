import { Box, Stack, Typography } from "@mui/material";
import ResourcesIcon from "./Icons/ResourcesIcon";
import { useEffect, useMemo, useState } from "react";
import { styleConfig } from "src/providerConfig";
import Link from "next/link";
import ResourceDropdownCurvedLine from "./Icons/ResourceDropdownCurvedLine";
import ResourceDropdownLine from "./Icons/ResourceDropdownLine";
import ResourceDropdownArrow from "./Icons/ResourceDropdownArrow";

const resourceItemHeight = 56;

const ResourceListItem = ({
  href,
  resourceName,
  isActive,
  isHighlighted, // For highlighting the ResourceDropdownLine
  isLastItem,
  isDisabled,
}) => {
  return (
    <Box
      display="flex"
      ml="16px"
      height={resourceItemHeight}
      alignItems="center"
    >
      <Box position="relative" width="20px" height="100%">
        {!isLastItem && (
          <ResourceDropdownLine
            isActive={isHighlighted}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "8px",
              zIndex: isHighlighted ? 2 : 0,
            }}
          />
        )}
        <ResourceDropdownCurvedLine
          isActive={isActive}
          style={{ position: "absolute", top: 0, left: "8px", right: 0 }}
        />
      </Box>

      <Link href={href}>
        <Box p="14px 16px">
          <Typography
            fontWeight="700"
            fontSize="14px"
            lineHeight="22px"
            letterSpacing="0.2px"
            color={
              isActive
                ? styleConfig.sidebarIconActiveColor
                : styleConfig.sidebarTextColor
            }
          >
            {resourceName}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

const ResourcesDropdown = ({
  activeResourceId,
  selectedResource,
  resourceUrlLink,
  resourceParameters,
  isDisabled = false,
}) => {
  const [isExpaned, setIsExpaned] = useState(
    !!selectedResource || !!activeResourceId
  );

  useEffect(() => {
    setIsExpaned(!!selectedResource || !!activeResourceId);
  }, [selectedResource, activeResourceId]);

  const selectedResourceIndex = useMemo(() => {
    const index = resourceParameters.findIndex(
      (el) =>
        el.urlKey === selectedResource || el.resourceId === activeResourceId
    );
    return index;
  }, [selectedResource, activeResourceId]);

  return (
    <Box width="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p="16px"
        onClick={() => setIsExpaned(!isExpaned)}
        sx={{ cursor: "pointer" }}
      >
        <Stack direction="row" alignItems="center" gap="10px">
          <ResourcesIcon disabled={isDisabled} active={isExpaned} />
          <Typography
            fontWeight="700"
            fontSize="14px"
            lineHeight="22px"
            letterSpacing="0.2px"
            color={isDisabled ? disabledColor : styleConfig.sidebarTextColor}
          >
            Resources
          </Typography>
        </Stack>

        <ResourceDropdownArrow isInverted={!isExpaned} />
      </Box>

      <Box
        sx={{
          maxHeight: isExpaned
            ? resourceItemHeight * resourceParameters.length
            : 0,
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        {resourceParameters?.length
          ? resourceParameters.map((resourceParameter, index) => (
              <ResourceListItem
                key={resourceParameter.resourceId}
                href={`${resourceUrlLink}&resourceId=${resourceParameter.resourceId}`}
                resourceName={resourceParameter.name}
                isActive={
                  resourceParameter.urlKey === selectedResource ||
                  resourceParameter.resourceId === activeResourceId
                }
                isHighlighted={index < selectedResourceIndex} // For highlighting the ResourceDropdownLine
                isLastItem={index === resourceParameters.length - 1} // For not showing the ResourceDropdownLine
              />
            ))
          : "No Resources Found"}
      </Box>
    </Box>
  );
};

export default ResourcesDropdown;
