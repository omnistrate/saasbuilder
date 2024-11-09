import { Stack, styled } from "@mui/material";
import { GridCell, GridRow, DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import DataGridCustomPagination from "./DataGridCustomPagination";
import CustomCheckbox from "../Checkbox/Checkbox";

const DataGrid = styled(
  ({ components, noRowsText = "No Rows", ...restProps }) => (
    <MuiDataGrid
      disableVirtualization // To Allow Vitest To Query All Columns
      rowsPerPageOptions={[10]}
      pageSize={10}
      rowHeight={48}
      headerHeight={44}
      components={{
        Cell: (props) => <GridCell data-testid={props.field} {...props} />,
        Row: (props) => <GridRow data-testid={props.rowId} {...props} />,
        BaseCheckbox: CustomCheckbox,
        Pagination: DataGridCustomPagination,
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            {noRowsText}
          </Stack>
        ),
        ...components,
      }}
      hideFooterSelectedRowCount
      {...restProps}
    />
  ),
  {
    shouldForwardProp: (prop) => !["showSelectAllCheckbox"].includes(prop),
  }
)(({ enableSelectAll = false }) => ({
  borderRadius: "12px",
  background: "white",
  boxShadow:
    "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
  border: "1px solid #EAECF0",
  "& .MuiDataGrid-main": {
    height: "591px", // height of rows container to have 10 rows(each of height 52px) without scroll inside table
  },
  // "& .MuiDataGrid-row:nth-of-type(2n+1)": {
  //   background: "#E4E7EC",
  // },
  "& .MuiDataGrid-columnHeader ": {
    padding: "0px 24px",
    color: "#475467",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "18px",
    background: "#F9FAFB",
  },
  //set padding left of first header cell and padding right of last header cell to 24
  "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader:first-child": {
    paddingLeft: "24px !important",
  },
  "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader:last-child": {
    paddingRight: "24px !important",
  },
  "& .MuiDataGrid-row .MuiDataGrid-cell:first-child": {
    paddingLeft: "24px !important",
  },
  "& .MuiDataGrid-row .MuiDataGrid-cell:last-child": {
    paddingRight: "24px !important",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    color: "#475467",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
  },
  "& .MuiDataGrid-columnHeader:focus": {
    borderRadius: "4px",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
    {
      display: enableSelectAll ? "flex" : "none",
    },
  "& .MuiTablePagination-root": {
    flex: 1,
  },
}));

//utility method to select one particular row in the data grid
export function selectSingleItem(
  newSelection,
  selectionModel,
  selectionModelSetter
) {
  if (newSelection.length > 0) {
    const selectionSet = new Set(selectionModel);
    const newSelectedItem = newSelection.filter((s) => !selectionSet.has(s));
    selectionModelSetter(newSelectedItem);
  } else {
    selectionModelSetter(newSelection);
  }
}

export default DataGrid;
