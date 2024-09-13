import Ansi from "@curvenote/ansi-to-react";
import { Box, Stack } from "@mui/material";
import React, { useState, useTransition, useEffect } from "react";
import { DisplayText, Text } from "../../Typography/Typography";
import Select from "../../FormElements/Select/Select";
import Card from "../../Card/Card";
import Divider from "../../Divider/Divider";
import MenuItem from "../../MenuItem/MenuItem";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import styled from "@emotion/styled";
import useSnackbar from "../../../hooks/useSnackbar";
import InfiniteScroll from "react-infinite-scroller";

const logsPerPage = 50;

function Logs(props) {
  const {
    nodes = [],
    socketBaseURL,
    instanceStatus,
    //resourceKey,
    resourceInstanceId,
    //mainResourceHasCompute,
  } = props;
  const [logs, setLogs] = useState([]);
  let selectedId = "";

  if (nodes.length > 0) {
    selectedId = nodes[0].id;
  }
  const [selectedNodeId, setSelectedNodeId] = useState(selectedId);
  const [errorMessage, setErrorMessage] = useState("");
  let logsSocketEndpoint = null;
  if (socketBaseURL && selectedNodeId) {
    logsSocketEndpoint = `${socketBaseURL}&podName=${selectedNodeId}&instanceId=${resourceInstanceId}`;
  }
  // else if (socketBaseURL && resourceKey && mainResourceHasCompute) {
  //   logsSocketEndpoint = `${socketBaseURL}&podName=${resourceKey}-0&instanceId=${resourceInstanceId}`;
  // }

  const [isLogsSocketConnected, setIsLogsSocketConnected] = useState(false);
  const [, startTransition] = useTransition();
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const [records, setRecords] = useState(logsPerPage);

  const loadMoreLogs = () => {
    if (records === logs.length) {
      setHasMoreLogs(false);
    } else if (records < logs.length) {
      setRecords((prev) => prev + logsPerPage);
    }
  };

  const snackbar = useSnackbar();
  useEffect(() => {
    setLogs([]);
  }, [selectedNodeId]);

  function handleNodeChange(event) {
    const { value } = event.target;
    setSelectedNodeId(value);
  }

  const { getWebSocket } = useWebSocket(logsSocketEndpoint, {
    onOpen: () => {
      // console.log("Socket Connection opened", event);
      setLogs([]);
      setIsLogsSocketConnected(true);
    },
    onError: (event) => {
      console.log("Socket connection error", event);
    },
    onMessage: (event) => {
      const data = event.data;
      startTransition(() => {
        setLogs((prevData) => [...prevData, data]);
      });
    },
    onClose: () => {
      // console.log("Socket Connection closed", event);
    },
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    retryOnError: true,
    reconnectInterval: (attemptNumber) => {
      const interval = Math.pow(2, attemptNumber) * 1000;
      return interval;
    },
    onReconnectStop: () => {
      if (isLogsSocketConnected) {
        snackbar.showError(
          "Unable to get the latest data. The displayed data might be outdated"
        );
      } else {
        // snackbar.showError("Unable to get the latest data...");
        setErrorMessage(
          "Can't access logs data. Please check if the instance is available and logs are enabled."
        );
      }
    },
  });

  useEffect(() => {
    function handleNetorkDisconnect() {
      snackbar.showError(
        "Network disconnected. The displayed data might be outdated"
      );
    }
    window.addEventListener("offline", handleNetorkDisconnect);
    //close the socket on unmount
    return () => {
      window.removeEventListener("offline", handleNetorkDisconnect);
      //console.log("Running cleanup");
      const socket = getWebSocket();
      if (socket) {
        //console.log("Socket", socket);
        socket.close();
        //console.log("Closing socket");
      }
    };
  }, [logsSocketEndpoint, snackbar, getWebSocket]);

  if (!logsSocketEndpoint) {
    return (
      <Card
        mt={3}
        sx={{
          paddingTop: "12.5px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "500px",
        }}
      >
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">
            Logs are not available{" "}
            {instanceStatus !== "RUNNING" && "as the instance is not running"}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      mt={3}
      sx={{
        paddingTop: "12.5px",
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight: "500px",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <DisplayText size="xsmall" sx={{ marginTop: "12px" }}>
          Logs
        </DisplayText>
        {nodes?.length > 0 && (
          <Box sx={{ minWidth: "320px" }}>
            <Text size="small" weight="medium" color="#344054">
              Container ID
            </Text>
            <Select
              value={selectedNodeId}
              sx={{ marginTop: "2px" }}
              onChange={handleNodeChange}
            >
              {nodes.map((node) => (
                <MenuItem value={node.id} key={node.id}>
                  {node.id}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Stack>
      <Divider sx={{ marginTop: "12px" }} />
      <LogsContainer>
        <InfiniteScroll
          pageStart={0}
          hasMore={hasMoreLogs}
          loadMore={loadMoreLogs}
          useWindow={false}
        >
          {isLogsSocketConnected
            ? logs
                .filter((log, index) => index < records)
                .map((log) => {
                  return (
                    <Log key={log}>
                      <Ansi>{log}</Ansi>
                    </Log>
                  );
                })
            : errorMessage || "Connecting..."}
        </InfiniteScroll>
      </LogsContainer>
    </Card>
  );
}

export default Logs;

const Log = styled("h3")({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "20px",
  color: "white",
  "&+&": {
    marginTop: 30,
  },
  wordBreak: "break-word",
});

const LogsContainer = styled(Box)(() => ({
  height: 500,
  overflowY: "auto",
  marginTop: 24,
  borderRadius: "4px",
  backgroundColor: "#282a36",
  padding: 24,
  fontFamily: "Monaco, monospace",
  color: "white",
}));
