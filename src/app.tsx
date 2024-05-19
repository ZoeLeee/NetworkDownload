import { useEffect, useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";
import { getActivaTab } from "./utils/message";

export function App() {
  const [list, setList] = useState<chrome.webRequest.WebRequestBodyDetails[]>(
    []
  );

  useEffect(() => {
    const callback = function (message, sender, sendResponse) {
      console.log("Message from background:", message);
      if (message.type === "send-data") {
        setList(message.data);
      }
    };
    // 在 popup 页面中监听来自 background 页面的消息
    chrome.runtime.onMessage.addListener(callback);

    chrome.runtime.sendMessage({
      type: "get-data",
      data: {
        origin: Number(new URLSearchParams(location.search).get("contentId")),
      },
    });

    return () => {
      chrome.runtime.onMessage.removeListener(callback);
    };
  }, []);

  return (
    <div>
      {list.map((item, index) => (
        <div key={index}>{item.url}</div>
      ))}
    </div>
  );
}
