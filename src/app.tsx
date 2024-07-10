import JSZip from "jszip";
import { useEffect, useMemo, useState } from "react";
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
import { Header, TFilter } from "./components/header";

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

  const [query, setQuery] = useState<TFilter>({
    query: "",
    type: "Resource",
    resourceTypes: [],
  });

  const [filterOrigins, filterList] = useMemo(() => {
    let os = origins.slice();
    let rs = { ...list };

    if (query.type === "Host") {
      if (query.query) {
        os = os.filter((item) => item.includes(query.query));
      }
    } else {
      if (query.query || query.resourceTypes.length > 0) {
        for (let k in rs) {
          rs[k] = rs[k].filter((item) => {
            let v = item.url.includes(query.query);
            if (query.resourceTypes.length > 0) {
              v = v && query.resourceTypes.includes(item.resourceType);
            }
            return v;
          });

          if (rs[k].length === 0) delete rs[k];
        }
      }
    }

    return [os, rs];
  }, [query, origins, list]);

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

  const handleSearch = (filter: TFilter) => {
    setQuery(filter);
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
      <div className="flex flex-col w-full h-full">
        <Header origin={origin} onChange={handleSearch} filter={query} />
        <Flex className="flex-1 min-h-0 overflow-hidden">
          <Origins
            origins={filterOrigins}
            origin={origin}
            setOrigin={handleChangeOrigin}
          />
          <Divider layout="vertical" />
          <Resource list={filterList} look={look} origin={origin} />
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
