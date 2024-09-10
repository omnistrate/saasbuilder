import { Box, IconButton, styled } from "@mui/material";
import { Text } from "../Typography/Typography";
import { useEffect, useRef } from "react";
import { Close } from "@mui/icons-material";
import useNotificationBar from "../../hooks/useNotificationBar";
import MuiLink from "next/link";

const NotificationBar = () => {
  const notificationBar = useNotificationBar();
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      notificationBar.setHeight(ref.current.offsetHeight);
    } else {
      notificationBar.setHeight(0);
    }
  }, [ref, notificationBar]);

  return (
    <Container ref={ref}>
      <IconButton
        sx={{ position: "absolute", right: "16px", top: "8px" }}
        onClick={() => {
          notificationBar.hide(true);
        }}
      >
        <Close />
      </IconButton>
      <Text
        size="medium"
        color="#6941C6"
        weight="medium"
        onClick={() => {
          notificationBar.hide();
        }}
      >
        You have not configured your payment method. Click{" "}
        <Link href="/billing"> here to configure</Link>{" "}
      </Text>
    </Container>
  );
};

export default NotificationBar;

const Container = styled(Box)(() => ({
  padding: "16px",
  background: "#F9F5FF",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1250,
  textAlign: "center",
}));

const Link = styled(MuiLink)(() => ({
  borderBottom: "1px solid #6941C6",
  display: "inline-block",
  paddingLeft: 2,
  paddingRight: 2,
}));
