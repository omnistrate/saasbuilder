import { Box, CircularProgress, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DisplayText } from "../Typography/Typography";
import GridCellExpand from "../GridCellExpand/GridCellExpand";
import formatDateLocal from "../../utils/formatDateLocal";

const columns = [
  { field: "resourceName", headerName: "Resource Name", flex: 1 },
  { field: "resourceInstanceId", headerName: "Resource Instance Id", flex: 1 },
  {
    field: "time",
    headerName: "Time",
    flex: 1,
    valueGetter: (params) => {
      const time = params.row.time;
      return formatDateLocal(time);
    },
  },
  {
    field: "message",
    headerName: "Message",
    flex: 1,
    renderCell: (params) => {
      const message = params.row.message;
      return (
        <GridCellExpand
          value={message || ""}
          width={params.colDef.computedWidth}
          justifyContent="flex-start"
          textStyles={{
            color: getColor(message),
          }}
        />
      );
    },
  },
];

const colors = {
  created: "#027A48",
  upgraded: "#15B79E",
  stopped: "#F04438",
  deleted: "#F04438",
  started: "#027A48",
  highCPU: "#F04438",
  scaledUp: "#4E5BA6",
  scaledDown: "#DC6803",
};

function getColor(message = "") {
  if (message.includes("created")) return colors.created;
  if (message.includes("upgraded")) return colors.upgraded;
  if (message.includes("stopped")) return colors.stopped;
  if (message.includes("started")) return colors.started;
  if (message.includes("high cpu usage")) return colors.highCPU;
  if (message.includes("scaled up")) return colors.scaledUp;
  if (message.includes("scaled down")) return colors.scaledDown;
}

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
