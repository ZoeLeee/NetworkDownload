import { useEffect, useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";
import { getActivaTab } from "./utils/message";
import JSZip from "jszip";

function getFileNameFromUrl(url) {
  // 使用正则表达式从 URL 中提取文件名
  var matches = url.match(/\/([^\/?#]+)$/);
  if (matches && matches.length > 1) {
    return matches[1]; // 返回匹配到的文件名
  } else {
    return null; // 如果未匹配到文件名，返回 null
  }
}

export function App() {
  const [list, setList] = useState<chrome.webRequest.WebRequestBodyDetails[]>(
    []
  );

  const handleDownload = () => {
    // 创建一个新的 JSZip 实例
    const zip = new JSZip();

    const resources = list.map((item) => ({
      url: item.url,
      filename: getFileNameFromUrl(item.url),
    }));
    let len = resources.length;
    let i = 0;
    console.log(`共${len}个资源`);
    // 下载并压缩资源
    Promise.all(
      resources.map(function (resource) {
        return fetch(resource.url)
          .then(function (response) {
            if (!response.ok) {
              throw new Error("下载失败: " + response.status);
            }
            return response.blob();
          })
          .then(function (blob) {
            // 将下载的资源添加到压缩包中
            console.log(`第${i++}/${len}个资源`);
            zip.file(resource.filename, blob);
          });
      })
    )
      .then(function () {
        // 生成压缩包
        return zip.generateAsync({ type: "blob" });
      })
      .then(function (content) {
        // 下载压缩包
        var url = URL.createObjectURL(content);
        var link = document.createElement("a");
        link.href = url;
        link.download = "resources.zip";
        link.click();
      });
  };

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
      <button onClick={handleDownload}>下载</button>
    </div>
  );
}
