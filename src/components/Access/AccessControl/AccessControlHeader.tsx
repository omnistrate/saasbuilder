import { Box, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import SearchInput from "src/components/DataGrid/SearchInput";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import { SetState } from "src/types/common/reactGenerics";

type AccessControlHeaderProps = {
  count?: number;
  searchText: string;
  setSearchText: SetState<string>;
};

const AccessControlHeader: FC<AccessControlHeaderProps> = ({
  count,
  searchText,
  setSearchText,
}) => {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p="20px"
        borderBottom="1px solid #EAECF0"
      >
        <DataGridHeaderTitle
          title={
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "28px",
                color: "#101828",
              }}
            >
              Manage Access
            </Typography>
          }
          count={count}
          units={{
            singular: "User",
            plural: "Users",
          }}
          desc="Manage your Users and their account permissions here."
        />

        <Stack direction="row" alignItems="center" gap="12px">
          <SearchInput
            placeholder="Search by Name/Email"
            searchText={searchText}
            setSearchText={setSearchText}
            width="250px"
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default AccessControlHeader;
