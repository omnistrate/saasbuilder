import { Box, Grid, Stack, styled } from "@mui/material";
import { DisplayText, Text } from "../../Typography/Typography";
import Select from "../../FormElements/Select/Select";
import Divider from "../../Divider/Divider";
import Card from "../../Card/Card";
import MenuItem from "../../MenuItem/MenuItem";
import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import MetricCard from "./MetricCard";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import CpuUsageChart from "./CpuUsageChart";
import MemUsagePercentChart from "./MemUsagePercentChart";
import LoadAverageChart from "./LoadAverageChart";
import DiskIOPSReadChart from "./DiskIOPSReadChart";
import DiskIOPSWriteChart from "./DiskIOPSWriteChart";
import DiskThroughputChart from "./DiskThroughputChart";
import NetworkThroughputChart from "./NetworkThroughputChart";
import DiskUsageChart from "./DiskUsageChart";
import useSnackbar from "../../../hooks/useSnackbar";
import formatDateUTC from "../../../utils/formatDateUTC";
import MultiLineChart from "./MultiLineChart";
import SingleLineChart from "./SingleLineChart";

const initialCpuUsage = {
  current: "",
  data: [],
};

const initialLoadAverage = {
  current: "",
  data: [],
};
const initialMemUsagePercentData = {
  current: "",
  data: [],
};

const connectionStatuses = {
  idle: "idle",
  connected: "connected",
  failed: "error",
  disconnected: "disconnected",
};

//store 4 hr data
const maxStorageTime = 3600 * 4;
//websocket reveives a new message every 60 seconds
const dataIncomeFrequency = 60;
const maxDataPoints = maxStorageTime / dataIncomeFrequency;

function Metrics(props) {
  const snackbar = useSnackbar();
  const {
    nodes = [],
    socketBaseURL,
    instanceStatus,
    resourceKey,
    resourceInstanceId,
    customMetrics = [],
  } = props;
  let firstNode = null;
  if (nodes.length > 0) {
    firstNode = nodes[0];
  }
  const [selectedNode, setSelectedNode] = useState(firstNode);
  const [errorMessage, setErrorMessage] = useState("");

  let metricsSocketEndpoint = null;
  if (socketBaseURL && selectedNode) {
    metricsSocketEndpoint = `${socketBaseURL}&podName=${selectedNode.id}&instanceId=${resourceInstanceId}`;
  } else if (socketBaseURL && resourceKey) {
    metricsSocketEndpoint = `${socketBaseURL}&podName=${resourceKey}-0&instanceId=${resourceInstanceId}`;
  }

  const socketOpenTime = useRef(null);
  const [isMetricsDataLoaded, setIsMetricsDataLoaded] = useState(false);
  const [socketConnectionStatus, setConnectionStatus] = useState(
    connectionStatuses.idle
  );
  const numConnectError = useRef(0);
  const [cpuUsageData, setCpuUsageData] = useState({
    current: "",
    data: [],
  });

  const [memUsagePercentData, setMemUsagePercentData] = useState({
    current: "",
    data: [],
  });

  const [loadAverage, setLoadAverage] = useState({
    current: "",
    data: [],
  });

  const [totalMemoryGB, setTotalMemoryGB] = useState(null);
  const [memoryUsageGB, setMemoryUsageGB] = useState(null);
  const [memoryUsagePercent, setMemoryUsagePercent] = useState(null);
  const [systemUptimeHours, setSystemUptimeHours] = useState(null);
  const [diskIOPSReadLabels, setDiskIOPSReadLabels] = useState([]);
  const [diskIOPSWriteLabels, setDiskIOPSWriteLabels] = useState([]);
  const [diskThroughputReadLabels, setDiskThroughputReadLabels] = useState([]);
  const [diskThroughputWriteLabels, setDiskThroughputWriteLabels] = useState(
    []
  );
  const [netThroughputReceiveLabels, setNetThroughputReceiveLabels] = useState(
    []
  );
  const [netThroughputSendLabels, setNetThroughputSendLabels] = useState([]);
  const [diskIOPSRead, setDiskIOPSRead] = useState([]);
  const [diskIOPSWrite, setDiskIOPSWrite] = useState([]);
  const [diskThroughputRead, setDiskThroughputRead] = useState([]);
  const [diskThroughputWrite, setDiskThroughputWrite] = useState([]);
  const [netThroughputReceive, setNetThroughputReceive] = useState([]);
  const [netThroughputSend, setNetThroughputSend] = useState([]);
  const [diskPathLabels, setDiskPathLabels] = useState([]);
  const [diskUsage, setDiskUsage] = useState([]);
  const [customMetricsChartData, setCustomMetricsChartData] = useState({});

  const { getWebSocket } = useWebSocket(metricsSocketEndpoint, {
    onOpen: (event) => {
      setIsMetricsDataLoaded(false);
      socketOpenTime.current = Date.now() / 1000;
      setConnectionStatus(connectionStatuses.connected);
      numConnectError.current = 0;
    },
    onError: (event) => {
      // console.log("Error socket", event);
      numConnectError.current = numConnectError.current + 1;
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      handleIncomingMetricEvent(data);
    },
    onClose: (event) => {
      //console.log("Socket connection closed");
    },
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    retryOnError: true,
    reconnectInterval: (attemptNumber) => {
      const interval = Math.pow(2, attemptNumber) * 1000;
      return interval;
    },
    onReconnectStop: (numAttempts) => {
      // console.log("Stopping", numAttempts);
      if (isMetricsDataLoaded) {
        snackbar.showError(
          "Unable to get the latest data. The displayed data might be outdated"
        );
      } else {
        // snackbar.showError("Unable to get the latest data...");
        setErrorMessage(
          "Can't access metrics data. Please check if the instance is available and metrics are enabled."
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
  }, []);

  const initialiseCustomMetricsData = useCallback(() => {
    const initialCustomMetricData = customMetrics.reduce((acc, curr) => {
      const { metricName } = curr;
      acc[metricName] = [];
      return acc;
    }, {});
    setCustomMetricsChartData(initialCustomMetricData);
  }, [customMetrics]);

  //initialise custom metrics data
  useEffect(() => {
    initialiseCustomMetricsData();
  }, [initialiseCustomMetricsData]);

  if (!metricsSocketEndpoint || errorMessage) {
    return (
      <ContainerCard>
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">
            {errorMessage ||
              `Metrics are not available ${
                instanceStatus !== "RUNNING"
                  ? "as the instance is not running"
                  : ""
              }`}
          </Text>
        </Stack>
      </ContainerCard>
    );
  }

  //console.log("connectionStatus", connectionStatus);
  function initialiseMetricsData() {
    setCpuUsageData(initialCpuUsage);
    setLoadAverage(initialLoadAverage);
    setMemUsagePercentData(initialMemUsagePercentData);
    setTotalMemoryGB(null);
    setMemoryUsageGB(null);
    setMemoryUsagePercent(null);
    setSystemUptimeHours(null);
    setDiskIOPSReadLabels([]);
    setDiskIOPSWriteLabels([]);
    setDiskThroughputReadLabels([]);
    setDiskThroughputWriteLabels([]);
    setNetThroughputReceiveLabels([]);
    setNetThroughputSendLabels([]);
    setDiskIOPSRead([]);
    setDiskIOPSWrite([]);
    setDiskThroughputRead([]);
    setDiskThroughputWrite([]);
    setNetThroughputReceive([]);
    setNetThroughputSend([]);
    setDiskPathLabels([]);
    setDiskUsage([]);
  }

  function metricMemUsagePercentData(memoryUsagePercent, formattedDate) {
    if (memoryUsagePercent && formattedDate) {
      const value = Math.round(memoryUsagePercent.Value);
      setMemUsagePercentData((prev) => {
        if (prev.data.length === maxDataPoints) {
          return {
            current: value,
            data: [
              ...prev.data.slice(1, maxDataPoints),
              {
                x: formattedDate,
                y: value,
              },
            ],
          };
        } else {
          return {
            current: value,
            data: [
              ...prev.data,
              {
                x: formattedDate,
                y: value,
              },
            ],
          };
        }
      });
    }
  }

  const handleIncomingMetricEvent = (data) => {
    const messageTime = data.UnixEpochTimestamp;

    const metrics = data.Metrics;

    const formattedDate = formatDateUTC(messageTime * 1000);
    // console.log("message time", messageTime);
    // console.log("socket open time", socketOpenTime.current);

    if (isOlderThanFourHours(messageTime)) {
    } else {
      //Start displaying metrics as soon as we receive data that is 2 min 10 seconds older than socket opening timestamp. We don't show the charts immediately as we wait and collect data to prevent too many rerenders
      if (
        socketOpenTime.current &&
        socketOpenTime.current - messageTime <= 140 &&
        !isMetricsDataLoaded
      ) {
        setIsMetricsDataLoaded(true);
      }
      //console.log("Data", data);
      if (metrics) {
        let loadAverage = null;
        let cpuUsage = null;
        let memoryUsageBytes = null;
        let totalMemoryBytes = null;
        let memoryUsagePercent = null;
        let systemUptime = null;
        let diskIOPSRead = { time: formattedDate };
        let diskIOPSWrite = { time: formattedDate };
        let diskThroughputRead = { time: formattedDate };
        let diskThroughputWrite = { time: formattedDate };
        let netThroughputReceive = { time: formattedDate };
        let netThroughputSend = { time: formattedDate };
        let diskUsage = { time: formattedDate };

        const customMetricsData = {};

        metrics.forEach((metric) => {
          if (metric.Name === "cpu_usage") {
            cpuUsage = metric;
          }
          if (metric.Name === "load_avg" && metric.Labels.period === "5min") {
            loadAverage = metric;
          }
          if (metric.Name === "mem_usage_bytes") {
            memoryUsageBytes = metric;
          }
          if (metric.Name === "mem_total_bytes") {
            totalMemoryBytes = metric;
          }
          if (metric.Name === "mem_total_bytes") {
            totalMemoryBytes = metric;
          }
          if (metric.Name === "mem_usage_percent") {
            memoryUsagePercent = metric;
            metricMemUsagePercentData(memoryUsagePercent, formattedDate);
          }
          if (metric.Name === "system_uptime_seconds") {
            systemUptime = metric;
          }
          if (
            metric.Name === "disk_ops_per_sec" &&
            metric.Labels.type === "read"
          ) {
            const value = metric.Value;
            const label = metric.Labels.disk;

            setDiskIOPSReadLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });
            diskIOPSRead[label] = value;
          }

          if (
            metric.Name === "disk_ops_per_sec" &&
            metric.Labels.type === "write"
          ) {
            const value = metric.Value;
            const label = metric.Labels.disk;

            setDiskIOPSWriteLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskIOPSWrite[label] = value;
          }

          if (
            metric.Name === "disk_throughput_bytes_per_sec" &&
            metric.Labels.type === "read"
          ) {
            const value = Number(metric.Value / 1000000).toFixed(2);
            const label = metric.Labels.disk;

            setDiskThroughputReadLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskThroughputRead[label] = value;
          }

          if (
            metric.Name === "disk_throughput_bytes_per_sec" &&
            metric.Labels.type === "write"
          ) {
            const value = Number(metric.Value / 1000000).toFixed(2);
            const label = metric.Labels.disk;

            setDiskThroughputWriteLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskThroughputWrite[label] = value;
          }

          if (
            metric.Name === "net_throughput_bytes_per_sec" &&
            metric.Labels.direction === "recv"
          ) {
            const value = Number(metric.Value / 1000000).toFixed(2);
            const label = metric.Labels.interface;

            setNetThroughputReceiveLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (interfaceLabel) => interfaceLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            netThroughputReceive[label] = value;
          }

          if (
            metric.Name === "net_throughput_bytes_per_sec" &&
            metric.Labels.direction === "sent"
          ) {
            const value = Number(metric.Value / 1000000).toFixed(2);
            const label = metric.Labels.interface;

            setNetThroughputSendLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (interfaceLabel) => interfaceLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            netThroughputSend[label] = value;
          }

          if (metric.Name === "disk_usage_percent") {
            const value = Math.round(metric.Value);
            const label = metric.Labels.path;
            setDiskPathLabels((prev) => {
              const isAlreadyPresent = prev.find((path) => path === label);

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskUsage[label] = value;
          }

          const customMetricMatch = customMetrics.find(
            (metricInfo) => metricInfo.metricName === metric.Name
          );

          if (customMetricMatch) {
            const labelName = metric.Labels.series_name;
            const value = metric.Value;

            //check if single line chart or multiline chart by looking at labels length
            //if labels length > 0, multiline
            if (customMetricMatch.labels.length > 0) {
              if (customMetricMatch.labels.includes(labelName)) {
                //check if value of some other label is already set
                if (customMetricsData[metric.Name]) {
                  customMetricsData[metric.Name] = {
                    ...customMetricsData[metric.Name],
                    [labelName]: value,
                    time: formattedDate,
                  };
                } else {
                  customMetricsData[metric.Name] = {
                    [labelName]: value,
                    time: formattedDate,
                  };
                }
              }
            } else {
              //single line chart data
              customMetricsData[metric.Name] = {
                x: formattedDate,
                y: value,
              };
            }
          }
        });

        //make sure each custom metric's data is available before appliying state update
        customMetrics.forEach((customMetricInfo) => {
          const { metricName, labels } = customMetricInfo;
          if (!(metricName in customMetricsData)) {
            //if data is not present, set default value based on whether it's single line or multi line chart
            //multiline
            if (labels.length > 0) {
              customMetricsData[metricName] = { time: formattedDate };
            } else {
              customMetricsData[metricName] = {
                x: formattedDate,
              };
            }
          }
        });

        //console.log("New custom Data point", customMetricsData)
        //set custom metrics chart data
        setCustomMetricsChartData((prev) => {
          const updatedData = {};
          Object.entries(prev).forEach(([metricName, prevMetricDataArray]) => {
            const newDataPoint = customMetricsData[metricName];

            if (prevMetricDataArray.length >= maxDataPoints) {
              updatedData[metricName] = [
                ...prevMetricDataArray.slice(1, maxDataPoints),
                newDataPoint,
              ];
            } else {
              updatedData[metricName] = [...prevMetricDataArray, newDataPoint];
            }
          });

          return updatedData;
        });

        //Set CPU Usage
        let value = null;
        if (cpuUsage) {
          value = Math.round(cpuUsage.Value);
        }

        setCpuUsageData((prev) => {
          if (prev.data.length === maxDataPoints) {
            return {
              current: value ? value : prev.current,
              data: [
                ...prev.data.slice(1, maxDataPoints),
                {
                  x: formattedDate,
                  y: value,
                },
              ],
            };
          } else {
            return {
              current: value ? value : prev.current,
              data: [
                ...prev.data,
                {
                  x: formattedDate,
                  y: value,
                },
              ],
            };
          }
        });

        //Set loadaverage
        let loadAverageValue = null;
        if (loadAverage) {
          loadAverageValue = loadAverage.Value;
        }
        setLoadAverage((prev) => {
          if (prev.data.length === maxDataPoints) {
            return {
              current: loadAverageValue ? loadAverageValue : prev.current,
              data: [
                ...prev.data.slice(1, maxDataPoints),
                {
                  x: formattedDate,
                  y: loadAverageValue,
                },
              ],
            };
          } else {
            return {
              current: loadAverageValue ? loadAverageValue : prev.current,
              data: [
                ...prev.data,
                {
                  x: formattedDate,
                  y: loadAverageValue,
                },
              ],
            };
          }
        });

        //Set memory bytes
        if (memoryUsageBytes) {
          const value = memoryUsageBytes.Value;
          setMemoryUsageGB(Number(value / 1000000000).toFixed(2));
        }

        if (totalMemoryBytes) {
          const value = totalMemoryBytes.Value;
          setTotalMemoryGB(Number(value / 1000000000).toFixed(2));
        }

        if (memoryUsagePercent) {
          const value = Number(memoryUsagePercent.Value).toFixed(0);

          setMemoryUsagePercent(value);
        }
        if (systemUptime) {
          const value = systemUptime.Value;
          let sysUptimeHours = 0;
          if (value > 0) {
            sysUptimeHours = Number(value / 3600).toFixed(1);
          }
          setSystemUptimeHours(sysUptimeHours);
        }

        if (diskIOPSRead) {
          setDiskIOPSRead((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskIOPSRead];
            } else {
              return [...prev, diskIOPSRead];
            }
          });
        }

        if (diskIOPSWrite) {
          setDiskIOPSWrite((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskIOPSRead];
            } else {
              return [...prev, diskIOPSRead];
            }
          });
        }

        if (diskThroughputRead) {
          setDiskThroughputRead((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskThroughputRead];
            } else {
              return [...prev, diskThroughputRead];
            }
          });
        }

        if (diskThroughputWrite) {
          setDiskThroughputWrite((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskThroughputWrite];
            } else {
              return [...prev, diskThroughputWrite];
            }
          });
        }

        if (netThroughputReceive) {
          setNetThroughputReceive((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), netThroughputReceive];
            } else {
              return [...prev, netThroughputReceive];
            }
          });
        }

        if (netThroughputSend) {
          setNetThroughputSend((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), netThroughputSend];
            } else {
              return [...prev, netThroughputSend];
            }
          });
        }

        if (diskUsage) {
          setDiskUsage((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskUsage];
            } else {
              return [...prev, diskUsage];
            }
          });
        }
      }
    }
  };

  function handleNodeChange(event) {
    setIsMetricsDataLoaded(false);
    const { value } = event.target;
    initialiseMetricsData();
    initialiseCustomMetricsData();
    setSelectedNode(value);
  }

  //console.log("Is metrics data loaded", isMetricsDataLoaded);

  // if (socketConnectionStatus === connectionStatuses.failed) {
  //   return <ConnectionFailureUI />;
  // }

  if (!isMetricsDataLoaded) {
    return <LoadingSpinner />;
  }

  //console.log("Is metrics data loaded", isMetricsDataLoaded);

  return (
    <ContainerCard>
      <Stack
        sx={{
          //marginTop: "46px",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <DisplayText size="xsmall" sx={{ marginTop: "12px" }}>
          Metrics
        </DisplayText>
        {nodes?.length > 0 && (
          <Box sx={{ minWidth: "320px" }}>
            <Text size="small" weight="medium" color="#344054">
              Node ID
            </Text>
            <Select
              value={selectedNode}
              sx={{ marginTop: "2px" }}
              onChange={handleNodeChange}
              MenuProps={{ disableScrollLock: true }}
            >
              {nodes.map((node) => (
                <MenuItem value={node} key={node.id}>
                  {node.displayName}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Stack>
      <Divider sx={{ marginTop: "12px" }} />

      <Grid container spacing={3} mt={0}>
        <Grid item xs={2}>
          <MetricCard title="CPU Usage" value={cpuUsageData.current} unit="%" />
        </Grid>
        <Grid item xs={2}>
          <MetricCard title="Load average" value={loadAverage.current} />
        </Grid>
        <Grid item xs={2}>
          <MetricCard title="Total RAM" value={totalMemoryGB} unit="GB" />
        </Grid>
        <Grid item xs={2}>
          <MetricCard title="Used RAM" value={memoryUsageGB} unit="GB" />
        </Grid>
        <Grid item xs={2}>
          <MetricCard
            title="RAM Usage (%)"
            value={memoryUsagePercent}
            unit="%"
          />
        </Grid>
        <Grid item xs={2}>
          <MetricCard
            title="System Uptime"
            value={systemUptimeHours}
            unit="hrs"
          />
        </Grid>
      </Grid>

      <CpuUsageChart data={cpuUsageData.data} />

      <Box mt={8}>
        <MemUsagePercentChart data={memUsagePercentData.data} />
      </Box>

      <Box mt={8}>
        <LoadAverageChart data={loadAverage.data} />
      </Box>

      <Box mt={8}>
        <DiskUsageChart data={diskUsage} labels={diskPathLabels} />
      </Box>

      <Box mt={8}>
        <DiskIOPSReadChart data={diskIOPSRead} labels={diskIOPSReadLabels} />
      </Box>

      <Box mt={8}>
        <DiskIOPSWriteChart data={diskIOPSWrite} labels={diskIOPSWriteLabels} />
      </Box>

      <Box mt={8}>
        <DiskThroughputChart
          chartName="Disk Throughput (Read)"
          data={diskThroughputRead}
          labels={diskThroughputReadLabels}
        />
      </Box>

      <Box mt={8}>
        <DiskThroughputChart
          chartName="Disk Throughput (Write)"
          data={diskThroughputWrite}
          labels={diskThroughputWriteLabels}
        />
      </Box>
      <Box mt={8}>
        <NetworkThroughputChart
          chartName="Network Throughput (Receive)"
          data={netThroughputReceive}
          labels={netThroughputReceiveLabels}
        />
      </Box>
      <Box mt={8}>
        <NetworkThroughputChart
          chartName="Network Throughput (Send)"
          data={netThroughputSend}
          labels={netThroughputSendLabels}
        />
      </Box>
      {customMetrics //show metrics for selected node resource type
        .filter((metric) => {
          if (selectedNode)
            return metric.resourceKey === selectedNode?.resourceKey;
          //else assume it's a serverless resource and filter by the main resource key
          else return metric.resourceKey === resourceKey;
        })
        .map((metricInfo) => {
          const { metricName, labels } = metricInfo;
          if (labels.length > 0)
            return (
              <MultiLineChart
                chartName={metricName}
                data={customMetricsChartData[metricName]}
                labels={labels}
                key={metricName}
              />
            );
          else
            return (
              <SingleLineChart
                chartName={metricName}
                data={customMetricsChartData[metricName]}
                key={metricName}
              />
            );
        })}
    </ContainerCard>
  );
}

export default Metrics;

function isOlderThanFourHours(unixTimestampSeconds) {
  const currentTimestamp = Date.now() / 1000;
  const timeDifferenceInSeconds = currentTimestamp - unixTimestampSeconds;
  if (timeDifferenceInSeconds / 3600 > 4) {
    return true;
  }
  return false;
}

export const MetricsCardsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  columnGap: "24px",
}));

const ConnectionFailureUI = () => {
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
        <Text size="xlarge">Failed to get metrics data</Text>
      </Stack>
    </Card>
  );
};

const ContainerCard = ({ children }) => {
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
      {children}
    </Card>
  );
};
