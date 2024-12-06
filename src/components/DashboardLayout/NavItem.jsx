import { Box, Collapse, Stack, styled } from "@mui/material";
import MuiList from "@mui/material/List";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import HoverSubMenu from "./HoverSubMenu";
import MuiTooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { styleConfig } from "src/providerConfig";

export const ListItem = styled(Link, {
  shouldForwardProp: (prop) =>
    ![
      "active",
      "clickDisabled",
      "nestingLevel",
      "disableHoverEffect",
      "hoverMenuItem",
      "isDrawerExpanded",
    ].includes(prop),
})(({ clickDisabled, nestingLevel }) => {
  const itemLeftPadding = 12;

  return {
    marginTop: 12,
    pointerEvents: clickDisabled ? "none" : "auto",
    minHeight: 40,
    color: "#FFFFFF",
    padding: 0,
    paddingRight: "12px",
    display: "block",
    cursor: "pointer",
    "&:hover": {
      color: `${styleConfig.sidebarTextActiveColor} !important`,
      backgroundColor: "#F2F4F7",
    },
    paddingLeft: nestingLevel
      ? `${(nestingLevel + 1) * (itemLeftPadding + 12)}px`
      : `${itemLeftPadding}px`,
    display: " flex",
    alignItems: "center",
    borderRadius: 8,
  };
});

export const NonLinkListItem = styled(Box, {
  shouldForwardProp: (prop) =>
    ![
      "active",
      "clickDisabled",
      "nestingLevel",
      "disableHoverEffect",
      "hoverMenuItem",
    ].includes(prop),
})(({ clickDisabled, nestingLevel }) => {
  const itemLeftPadding = 12;

  return {
    marginTop: 12,
    pointerEvents: clickDisabled ? "none" : "auto",
    minHeight: 40,
    color: "#FFFFFF",
    padding: 0,
    paddingRight: "12px",
    display: "block",
    cursor: "pointer",
    "&:hover": {
      color: `${styleConfig.sidebarTextActiveColor} !important`,
      backgroundColor: "#F2F4F7",
    },
    paddingLeft: nestingLevel
      ? `${(nestingLevel + 1) * (itemLeftPadding + 11)}px`
      : `${itemLeftPadding}px`,
    display: " flex",
    alignItems: "center",
    borderRadius: 8,
  };
});

const NavItem = (props) => {
  const router = useRouter();
  const [currentURL, setCurrentURL] = useState("");
  const currentPath = router.pathname;
  const textRef = useRef(null);

  const {
    isActive,
    name,
    iconSrc,
    iconAlt = "nav-icon",
    href = "",
    subItems = [],
    disabled,
    hidden,
    IconComponent,
    IconComponentProps = {},
    openInNewTab,
    nestingLevel = 0,
    isExpandible = false,
    disableHoverEffect = false,
    hoverMenuItem = false,
    defaultExpanded = false,
  } = props;

  const [expanded, setExpanded] = useState(defaultExpanded);

  const isOverflow = useMemo(() => {
    const element = textRef.current;
    if (element) return element.scrollWidth > element.offsetWidth;
    else return false;
  }, [textRef.current]);

  useEffect(() => {
    if (defaultExpanded) {
      setExpanded(true);
    }
  }, [defaultExpanded]);

  function handleExpandToggle() {
    if (isExpandible) {
      setExpanded((prev) => !prev);
    }
  }

  useEffect(() => {
    if (window) {
      setCurrentURL(window.location.href);
    }
  }, []);

  const isDrawerExpanded = true;

  if (hidden) return "";

  let route = href;
  if (!route) {
    route = currentURL;
  }

  let iconColor = styleConfig.sidebarIconColor;
  if (disabled) {
    iconColor = styleConfig.sidebarIconDisabledColor;
    IconComponentProps.disabled = true;
  }
  if (isActive) {
    iconColor = styleConfig.sidebarIconActiveColor;
  }

  IconComponentProps.color = iconColor;

  let ListItemComponent = ListItem;
  if (!href) {
    ListItemComponent = NonLinkListItem;
  }

  return (
    <>
      <MenuHoverTooltip
        // title={name}
        title={
          <HoverSubMenu
            name={name}
            nestingLevel={nestingLevel}
            subItems={subItems}
          />
        }
        arrow={false}
        isVisible={isOverflow}
        // open={name === "Build Services"}
      >
        <ListItemComponent
          nestingLevel={nestingLevel}
          active={isActive}
          clickDisabled={disabled}
          href={route ?? ""}
          target={openInNewTab ? "_blank" : "_self"}
          disableHoverEffect={disableHoverEffect}
          onClick={handleExpandToggle}
          hoverMenuItem={hoverMenuItem}
          isDrawerExpanded={isDrawerExpanded}
        >
          <StyledLinkContainer flexGrow={1}>
            <Stack direction="row" alignItems="center">
              <Box flexShrink={0} display="flex" alignItems="center">
                {IconComponent ? (
                  <IconComponent active={isActive} {...IconComponentProps} />
                ) : (
                  <ListItemIcon src={iconSrc} alt={iconAlt} />
                )}
              </Box>

              <ListItemText
                ref={textRef}
                clickDisabled={disabled}
                active={isActive}
                visible={isDrawerExpanded || nestingLevel === 1}
              >
                {name}
              </ListItemText>
            </Stack>
            {isExpandible &&
              subItems.length > 0 &&
              isDrawerExpanded &&
              (expanded ? (
                <ExpandLessIcon sx={{ color: styleConfig.sidebarIconColor }} />
              ) : (
                <ExpandMoreIcon sx={{ color: styleConfig.sidebarIconColor }} />
              ))}
          </StyledLinkContainer>
        </ListItemComponent>
      </MenuHoverTooltip>
      <Collapse in={expanded}>
        {subItems.length > 0 ? (
          <SubList isDrawerExpanded={isDrawerExpanded}>
            {subItems.map((navItem) => {
              const {
                name,
                IconComponent,
                icon,
                // alt,
                isActive,
                activeRoutes = [],
                href,
                disabled,
                hidden,
                subItems = [],
                openInNewTab,
                IconComponentProps = {},
              } = navItem;

              let isNavItemActive = false;

              if (isActive !== undefined) {
                isNavItemActive = isActive;
              } else {
                isNavItemActive = activeRoutes.some(
                  (path) => currentPath === path
                );
              }

              return (
                <NavItem
                  key={name}
                  isActive={isNavItemActive}
                  name={name}
                  href={href}
                  iconSrc={icon}
                  subItems={subItems}
                  nestingLevel={nestingLevel + 1}
                  disabled={disabled}
                  hidden={hidden}
                  IconComponent={IconComponent}
                  IconComponentProps={IconComponentProps}
                  openInNewTab={openInNewTab}
                />
              );
            })}
          </SubList>
        ) : (
          ""
        )}
      </Collapse>
    </>
  );
};

export default NavItem;

export const StyledLinkContainer = styled(Box)({
  display: "block",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6px",
});

export const ListItemIcon = styled(Image)({
  display: "inline-block",
  width: 20,
  height: 20,
});

export const ListItemText = styled("span", {
  shouldForwardProp: (prop) =>
    !["active", "visible", "clickDisabled"].includes(prop),
})(({ visible = true, active, clickDisabled }) => ({
  display: visible ? "inline-block" : "none",
  color: clickDisabled
    ? "#716F6F"
    : active
      ? styleConfig.sidebarTextActiveColor
      : styleConfig.sidebarTextColor,
  marginLeft: 12,
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "20px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "180px",
}));

const SubList = styled(MuiList, {
  shouldForwardProp: (prop) => prop !== "isDrawerExpanded",
})(({ isDrawerExpanded }) => ({
  display: isDrawerExpanded ? "block" : "none",
  paddingTop: 0,
  paddingBottom: 0,
  "& .MuiListItem-root": {
    marginTop: 6,
  },
}));

export const MenuHoverTooltip = styled(
  ({ className, ...props }) => (
    <MuiTooltip
      classes={{ popper: className }}
      placement="right-start"
      {...props}
    />
  ),
  {
    shouldForwardProp: (prop) => prop !== "isVisible",
  }
)(({ isVisible = true }) => ({
  display: isVisible ? "block" : "none",
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#040E25",
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 600,
    margin: 0,
    padding: 0,
    borderRadius: "0px 8px 8px 0px",
    borderLeft: "1px solid #737373",
    marginLeft: "24px",
  },
}));

export const MenuHoverTooltipTitle = styled(Box)(() => ({
  padding: "12px 14px",
  borderBottom: "1px solid rgba(127, 129, 148, 0.19)",
  minHeight: "46px",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));
