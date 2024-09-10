import { createContext, useState } from "react";

export const NotificationBarContext = createContext(null);

export default function NotificationBarProvider(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationBarHeight, setNotificationBarHeight] = useState(0);

  function showNotificationBar() {
    setIsVisible(true);
  }

  function hideNotificationBar() {
    // if (setLocalStorageKey)
    localStorage.setItem("paymentNotificationHidden", "true");
    setIsVisible(false);
  }

  return (
    <NotificationBarContext.Provider
      value={{
        isVisible: isVisible,
        height: isVisible ? notificationBarHeight : 0,
        show: showNotificationBar,
        hide: hideNotificationBar,
        setHeight: setNotificationBarHeight,
      }}
    >
      {props.children}
    </NotificationBarContext.Provider>
  );
}
