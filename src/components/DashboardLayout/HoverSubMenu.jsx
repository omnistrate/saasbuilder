import MuiList from "@mui/material/List";

import { Box, styled } from "@mui/material";
import React from "react";
import NavItem, { MenuHoverTooltipTitle } from "./NavItem";
import { useRouter } from "next/router";

function HoverSubMenu(props) {
  const { name: parentName, subItems, nestingLevel } = props;
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <Box>
      <MenuHoverTooltipTitle>{parentName}</MenuHoverTooltipTitle>
      {subItems.length > 0 ? (
        <SubList>
          {subItems.map((navItem) => {
            const {
              name,
              IconComponent,
              icon,
              isActive,
              activeRoutes=[],
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

            //always show the submenu for fleet.
            let shouldHide = hidden;

            if (parentName == "Manage Fleet") {
              shouldHide = false;
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
                hidden={shouldHide}
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
    </Box>
  );
}

export default HoverSubMenu;

const SubList = styled(MuiList, {
  shouldForwardProp: (prop) => prop !== "isDrawerExpanded",
})(() => ({
  paddingTop: 0,
  paddingBottom: 0,
  marginTop: 6,
  "& .MuiListItem-root": {},
}));
