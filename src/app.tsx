import JSZip from "jszip";
import { useEffect, useState } from "react";
import "./app.css";

import { FileMap, TResource } from "./types";

import { Viewer } from "./components/viewer";

import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Flex } from "./components/flex";
import { Origins } from "./components/origins";
import { Resource } from "./components/resource";
import { Text } from "./components/text";
import { SpeedDial } from "primereact/speeddial";

function getFileNameFromUrl(url) {
  // 使用正则表达式从 URL 中提取文件名
  const matches = url.match(/\/([^\/?#]+)$/);
  if (matches && matches.length > 1) {
    return matches[1]; // 返回匹配到的文件名
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    return null; // 如果未匹配到文件名，返回 null
  }
}

export function App() {
  const [list, setList] = useState<FileMap>({});
  const [viewItem, setViewItem] = useState<TResource | null>(null);
  const [origin, setOrigin] = useState("");
  const [open, setOpen] = useState(false);
  const [origins, setOrigins] = useState<string[]>([]);

  const handleDownload = (items: TResource[], name?: string) => {
    // 创建一个新的 JSZip 实例
    const zip = new JSZip();

    const resources = items.map((item) => ({
      url: item.url,
      filename: getFileNameFromUrl(item.url),
    }));
    let len = resources.length;
    let i = 0;
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

        if (name) {
          const strs = name.split("/");
          name = strs.pop();
        }

        link.download = name ? name + ".zip" : "resources.zip";
        link.click();
      });
  };

  const downloadUrl = (item: TResource) => {
    fetch(item.url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("下载失败: " + response.status);
        }
        return response.blob();
      })
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        const name = getFileNameFromUrl(item.url);
        link.download = name;
        link.click();
      });
  };

  const getfileName = (url: string) => {
    const arr = url.split("/");

    return arr[arr.length - 1];
  };

  const handleChangeOrigin = (origin: string) => {
    setOrigin(origin);
    chrome.runtime.sendMessage({
      type: "get-data",
      data: {
        origin: origin,
      },
    });
  };

  const getOriginList = () => {
    // setOpen(true);
    chrome.runtime.sendMessage({
      type: "get-origins",
      data: {},
    });
  };

  const look = (url: TResource) => {
    setViewItem(url);
  };

  const refresh = () => {
    if (!origin) return;
    chrome.tabs.query({ url: origin + "/*" }, function (tabs) {
      if (tabs) {
        for (const tab of tabs) {
          chrome.tabs.reload(tab.id).then(() => {
            // 监听标签页加载完成事件
            chrome.tabs.onUpdated.addListener(function listener(
              tabId,
              changeInfo
            ) {
              if (tabId === tab.id && changeInfo.status === "complete") {
                console.log(`Tab ${tab.id} loaded`);
                // 移除监听器
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.runtime.sendMessage({
                  type: "get-data",
                  data: {
                    origin: origin,
                  },
                });
              }
            });
          });
        }
      }
    });
  };

  useEffect(() => {
    const callback = (message, sender, sendResponse) => {
      if (message.type === "send-data") {
        setOrigin(message.origin ?? "");
        setList(message.data ?? []);
      } else if (message.type === "send-origins") {
        setOrigins(message.data ?? []);
      }
    };

    if (!chrome) {
      return;
    }

    // 在 popup 页面中监听来自 background 页面的消息
    chrome.runtime.onMessage.addListener(callback);

    chrome.runtime.sendMessage({
      type: "get-data",
      data: {
        tabId: Number(new URLSearchParams(location.search).get("contentId")),
      },
    });
    getOriginList();

    return () => {
      chrome.runtime.onMessage.removeListener(callback);
    };
  }, []);

  return (
    <PrimeReactProvider>
      <div className="flex flex-col w-full h-full pb-5 border-b border-gray-100">
        {/* <Flex className="items-center h-10 p-2 gap-10">
          <Text className="text-lg font-bold">{origin}</Text>
          <Flex className="flex-1 flex items-center h-full overflow-hidden">
            <InputText size="small" />
            <Button icon="pi pi-search" size="small" />
          </Flex>
        </Flex> */}
        <Flex className="flex-1 min-h-0 overflow-hidden">
          <Origins
            origins={origins}
            origin={origin}
            setOrigin={handleChangeOrigin}
          />
          <Divider layout="vertical" />
          <Resource list={list} look={look} />
          <Divider layout="vertical" />
          <div className="flex-1 w-full h-full overflow-hidden">
            {viewItem && <Viewer item={viewItem} />}
          </div>
        </Flex>
        <SpeedDial
          model={[
            {
              label: "Update",
              icon: "pi pi-refresh",
              command: () => {
                refresh();
              },
            },
          ]}
          direction="up"
          style={{ right: 10, bottom: 10 }}
          pt={{
            button: {
              root: {
                style: {
                  width: "3rem",
                  height: "3rem",
                },
              },
            },
          }}
        />
      </div>
    </PrimeReactProvider>
  );
}
