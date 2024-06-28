import { Box, CircularProgress, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DisplayText } from "../Typography/Typography";
import EventMessageChip from "./EventMessageChip";

const columns = [
  { field: "resourceName", headerName: "Resource Name", flex: 1 },
  { field: "resourceInstanceId", headerName: "Resource Instance ID", flex: 1 },
  {
    field: "time",
    headerName: "Time",
    flex: 1,
    valueGetter: (params) => {
      const time = params.row.time;
      let formattedTime = "";

      if (time) {
        formattedTime = time.split("T").join(" ").slice(0, 19) + " UTC";
      }

      return formattedTime;
    },
  },
  {
    field: "message",
    headerName: "Message",
    flex: 1,
    renderCell: (params) => {
      const message = params.row.message;
      return <EventMessageChip message={message} />;
    },
  },
];

const Header = (props) => {
  const { title = "List of Events", isRefetching } = props;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ padding: "30px 20px 22px 20px", borderBottom: "1px solid #EAECF0" }}
    >
      <DisplayText> {title}</DisplayText>
      {isRefetching && <CircularProgress size={24} />}
    </Stack>
  );
};

function EventsTable(props) {
  const {
    title,
    events,
    isRefetching,
    components,
    sx = {},
    ...restProps
  } = props;

  let componentsObj = {
    NoRowsOverlay: () => {
      return "";
    },
  };
  if (title) {
    componentsObj.Header = function GridHeader() {
      return <Header title={title} isRefetching={isRefetching} />;
    };
  }

  componentsObj = { ...componentsObj, components };
  return (
    <Box height="922px" bgcolor="white" mt="20px">
      <DataGrid
        columns={columns}
        rows={events}
        components={componentsObj}
        sx={{
          borderRadius: "12px",
          "& .MuiDataGrid-columnHeader ": {
            padding: "0px 24px",
            color: "#667085",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "18px",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell": {
            padding: "0px 24px",
            color: "#475467",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "20px",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            borderRadius: "4px",
          },
          ...sx,
        }}
        rowHeight={72}
        rowsPerPageOptions={[10]}
        pageSize={10}
        {...restProps}
      />
    </Box>
  );
}

export default EventsTable;
