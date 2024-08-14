import { PanelMenu } from "primereact/panelmenu";
import React, { useEffect, useMemo, useState } from "react";
import { FileMap, TResource } from "../types";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { getFileNameFromUrl } from "../utils";
import JSZip from "jszip";
import { Text } from "./text";

type Props = {
  list: FileMap;
  look: (url: TResource) => void;
  origin: string;
  refresh: () => void;
};

export const Resource = ({ list, look, origin, refresh }: Props) => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});

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

  const download = (data: {
    item: TResource;
    dir: boolean;
    items: TResource[];
    url: string;
  }) => {
    if (data.dir) {
      handleDownload(data.items, data.url);
    } else {
      downloadUrl(data.item);
    }
  };

  const itemRenderer = (item: MenuItem, options: MenuItemOptions) => {
    return (
      <div className="flex items-center gap-1 overflow-hidden w-full px-4 py-2">
        {!item.data.dir && (
          <Tag value={item.data.resourceType} className="w-1/5" />
        )}
        <span
          className={`flex-1 min-w-0 text-ellipsis overflow-hidden whitespace-nowrap`}
          title={item.label}
        >
          {item.label}
        </span>
        <div className="flex w-1/5 justify-end">
          <Button
            icon="pi pi-download"
            size="small"
            rounded
            text
            onClick={(evt) => {
              evt.stopPropagation();
              download(item.data);
            }}
          />
          {!item.data.dir && (
            <Button
              icon="pi pi-eye"
              size="small"
              rounded
              text
              onClick={() => look(item.data.item)}
            />
          )}
        </div>
      </div>
    );
  };

  const items = useMemo(() => {
    const nodes: MenuItem[] = [];
    const keys = Object.keys(list);

    for (const key of keys) {
      nodes.push({
        label: key,
        key: key,
        data: {
          dir: true,
          items: list[key],
          url: key,
        },
        template: itemRenderer,
        items: list[key].map((item) => {
          return {
            label: getFileNameFromUrl(item.url),
            key: item.url,
            data: {
              dir: false,
              resourceType: item.resourceType,
              item: item,
            },
            template: itemRenderer,
          };
        }),
      });
    }

    return nodes;
  }, [list]);

  useEffect(() => {
    const keys = Object.keys(list);
    setExpandedKeys(
      keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
  }, [origin]);

  return (
    <div className="w-1/4 h-full overflow-auto">
      {items.length === 0 ? (
        <div className="text-center">
          <Text className="text-center text-lg">Resource is empty</Text>
          <Button onClick={refresh}>Refresh</Button>
        </div>
      ) : null}
      <PanelMenu
        multiple
        model={items}
        className="w-full h-full"
        expandedKeys={expandedKeys}
        onExpandedKeysChange={(e, ...arg) => {
          setExpandedKeys(e);
        }}
        pt={{
          header: {},
          headerLabel: {
            className: "whitespace-nowrap text-ellipsis overflow-hidden",
          },
        }}
      />
    </div>
  );
};
