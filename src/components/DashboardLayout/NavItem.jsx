import { Box, styled } from "@mui/material";
import MuiList from "@mui/material/List";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDrawerExpandedState } from "../../slices/dashboardSideDrawerSlice";
import HoverSubMenu from "./HoverSubMenu";
import MuiTooltip, { tooltipClasses } from "@mui/material/Tooltip";

const NavItem = (props) => {
  const router = useRouter();
  const [currentURL, setCurrentURL] = useState("");
  const currentPath = router.pathname;

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
  } = props;

  useEffect(() => {
    if (window) {
      setCurrentURL(window.location.href);
    }
  }, []);

  const isDrawerExpanded = useSelector(selectDrawerExpandedState);

  if (hidden) return "";

  let route = href;
  if (!route) {
    route = currentURL;
  }
  IconComponentProps.color = disabled ? "#716F6F" : "#FFFFFF";
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
        isVisible={!isDrawerExpanded && nestingLevel === 0}
        // open={name === "Build Services"}
      >
        <ListItem
          nestingLevel={nestingLevel}
          active={isActive}
          clickDisabled={disabled}
          href={route ?? ""}
          target={openInNewTab ? "_blank" : "_self"}
        >
          <StyledLinkContainer>
            {IconComponent ? (
              <IconComponent active={isActive} {...IconComponentProps} />
            ) : (
              <ListItemIcon src={iconSrc} alt={iconAlt} />
            )}

            <ListItemText
              clickDisabled={disabled}
              active={isActive}
              visible={isDrawerExpanded || nestingLevel === 1}
            >
              {name}
            </ListItemText>
          </StyledLinkContainer>
        </ListItem>
      </MenuHoverTooltip>
      {subItems.length > 0 ? (
        <SubList isDrawerExpanded={isDrawerExpanded}>
          {subItems.map((navItem) => {
            const {
              name,
              IconComponent,
              icon,
              isActive,
              activeRoutes,
              route,
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
                href={route}
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
    </>
  );
};

export default NavItem;

export const ListItem = styled(Link, {
  shouldForwardProp: (prop) =>
    !["active", "clickDisabled", "nestingLevel"].includes(prop),
})(({ active, clickDisabled, nestingLevel }) => ({
  pointerEvents: clickDisabled ? "none" : "auto",
  minHeight: 46,
  color: "#FFFFFF",
  padding: 0,
  paddingRight: "20px",
  display: "block",
  cursor: "pointer",
  "&:hover": {
    borderImage: "linear-gradient(to right,#00C853, rgba(0, 0, 0, 0) ) 1 100%",
    borderImageSlice: 1,
    borderWidth: "0.5px",
    borderLeftWidth: "3px",
    borderStyle: "solid",
    borderRight: "0px",
    paddingLeft: nestingLevel
      ? `${(nestingLevel + 1) * 21 - 3}px`
      : `${22 - 3}px`,
    paddingTop: `${10 - 1}px`,
    paddingBottom: `${10 - 1}px`,
  },
  background: active ? "rgba(255, 255, 255, 0.09)" : "",
  borderImage: active
    ? "linear-gradient(to right,#00C853, rgba(0, 0, 0, 0) ) 1 100%"
    : "",
  borderImageSlice: 1,
  borderWidth: active ? "0.5px" : "",
  borderLeftWidth: active ? "3px" : "",
  borderStyle: active ? "solid" : "",
  borderRight: "0px",
  paddingLeft: active
    ? nestingLevel
      ? `${(nestingLevel + 1) * 21 - 3}px`
      : `${22 - 3}px`
    : nestingLevel
      ? `${(nestingLevel + 1) * 21}px`
      : "22px",
  paddingTop: active ? `${10 - 1}px` : "10px",
  paddingBottom: active ? `${10 - 1}px` : "10px",
}));

export const ListItemNonLink = styled(Box, {
  shouldForwardProp: (prop) =>
    !["active", "clickDisabled", "nestingLevel"].includes(prop),
})(({ active, clickDisabled, nestingLevel }) => ({
  pointerEvents: clickDisabled ? "none" : "auto",
  minHeight: 46,
  color: "#FFFFFF",
  padding: 0,
  paddingRight: "20px",
  display: "block",
  cursor: "pointer",
  "&:hover": {
    borderImage: "linear-gradient(to right,#00C853, rgba(0, 0, 0, 0) ) 1 100%",
    borderImageSlice: 1,
    borderWidth: "0.5px",
    borderLeftWidth: "3px",
    borderStyle: "solid",
    borderRight: "0px",
    paddingLeft: nestingLevel
      ? `${(nestingLevel + 1) * 21 - 3}px`
      : `${22 - 3}px`,
    paddingTop: `${10 - 1}px`,
    paddingBottom: `${10 - 1}px`,
  },
  background: active ? "rgba(255, 255, 255, 0.09)" : "",
  borderImage: active
    ? "linear-gradient(to right,#00C853, rgba(0, 0, 0, 0) ) 1 100%"
    : "",
  borderImageSlice: 1,
  borderWidth: active ? "0.5px" : "",
  borderLeftWidth: active ? "3px" : "",
  borderStyle: active ? "solid" : "",
  borderRight: "0px",
  paddingLeft: active
    ? nestingLevel
      ? `${(nestingLevel + 1) * 21 - 3}px`
      : `${22 - 3}px`
    : nestingLevel
      ? `${(nestingLevel + 1) * 21}px`
      : "22px",
  paddingTop: active ? `${10 - 1}px` : "10px",
  paddingBottom: active ? `${10 - 1}px` : "10px",
}));

export const StyledLinkContainer = styled(Box)({
  display: "block",
  display: "flex",
  alignItems: "center",
});

export const ListItemIcon = styled(Image)({
  display: "inline-block",
  width: 20,
  height: 20,
});

export const ListItemText = styled("span", {
  shouldForwardProp: (prop) =>
    !["active", "visible", "clickDisabled"].includes(prop),
})(({ visible = true, clickDisabled }) => ({
  display: visible ? "inline-block" : "none",
  color: clickDisabled ? "#716F6F" : "#FFFFFF",
  marginLeft: 12,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "26px",
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
    marginLeft: "0px !important",
    padding: 0,
    borderRadius: "0px 8px 8px 0px",
    borderLeft: "1px solid #737373",
  },
}));

export const MenuHoverTooltipTitle = styled(Box)(() => ({
  padding: "12px 14px",
  borderBottom: "1px solid rgba(127, 129, 148, 0.19)",
  height: "46px",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));
