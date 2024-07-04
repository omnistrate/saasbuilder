import { Stack, Tooltip, styled } from "@mui/material";
import MuiTableContainer from "@mui/material/TableContainer";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import { Text } from "../Typography/Typography";
import CopyToClipbpoardButton from "../CopyClipboardButton/CopyClipboardButton";

export const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  background: "#FFFFFF",
  border: "1px solid #EAECF0",
  boxShadow:
    "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
  borderRadius: "12px",
  padding: "10px 20px",
}));

export const Table = styled(MuiTable)(({ theme }) => ({}));

export const TableBody = styled(MuiTableBody)(({ theme }) => ({}));

export const TableRow = styled(MuiTableRow)(({ theme }) => ({
  borderBottom: "1px solid #EAECF0",
  "&:last-child": {
    borderBottom: "none",
  },
}));

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: "16px 20px",
  borderBottom: "none",
}));

export const CellTitle = styled((props) => (
  <Text size="large" weight="semibold" color="#344054" {...props} />
))({});

export const CellSubtext = styled((props) => (
  <Text size="small" weight="regular" color="#475467" {...props} />
))({
  mt: "2px",
});

export const CellDescription = (props) => {
  const { children } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{ width: "100%" }}
      gap="10px"
    >
      <Tooltip title={children} placement="top" arrow>
        {/* Div is necessary for showing the Tooltip */}
        <div>
          <Text size="large" color="#475467">
            {typeof children === "string"
              ? `${children?.slice(0, 100)}${children?.length > 100 ? "..." : ""}`
              : children}
          </Text>
        </div>
      </Tooltip>
      {children && typeof children === "string" && (
        <CopyToClipbpoardButton text={children} />
      )}
    </Stack>
  );
};
