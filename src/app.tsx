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
    <div className="w-full h-full">
      {list.map((item, index) => (
        <div key={index}>{item.url}</div>
      ))}
      {/* <ul role="list" className="divide-y divide-gray-100">
        {list.map((item) => (
          <li key={item.url} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={item.imageUrl}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {item.name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {item.email}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{item.role}</p>
              {item.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{" "}
                  <time dateTime={item.lastSeenDateTime}>{item.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul> */}
      <button onClick={handleDownload}>下载</button>
    </div>
  );
}
