import { useEffect, useMemo, useState } from "react";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";
import { getActivaTab } from "./utils/message";
import JSZip from "jszip";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  ChakraProvider,
  Heading,
  IconButton,
  Link,
  List,
  ListIcon,
  ListItem,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { DownloadIcon, ViewIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FileMap, TResource } from "./types";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Viewer } from "./components/viewer";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";

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

  const keys = Object.keys(list);

  const getfileName = (url: string) => {
    const arr = url.split("/");

    return arr[arr.length - 1];
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getOriginList = () => {
    setOpen(true);
    chrome.runtime.sendMessage({
      type: "get-origins",
      data: {},
    });
  };

  const selectOrigin = (origin) => {
    chrome.runtime.sendMessage({
      type: "get-data",
      data: {
        origin: origin,
      },
    });
    handleClose();
  };

  const look = (url: TResource) => {
    setViewItem(url);
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

    return () => {
      chrome.runtime.onMessage.removeListener(callback);
    };
  }, []);

  return (
    <ChakraProvider>
      <Flex w="100%" h="100%">
        <Box w="40%" bg="" overflow="auto" h="100%">
          <Heading as="h5" size="sm">
            Host: {origin}
            <IconButton aria-label="more host" onClick={getOriginList}>
              <HamburgerIcon />
            </IconButton>
          </Heading>
          {keys.map((k) => {
            return (
              <Accordion key={k} allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        overflow="hidden"
                      >
                        {k}
                      </Box>
                      <IconButton
                        size="sm"
                        fontSize="12px"
                        aria-label="download"
                        boxSize={10}
                        icon={<DownloadIcon />}
                        onClick={(evt) => {
                          evt.stopPropagation();
                          handleDownload(list[k], k);
                        }}
                      />
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <List>
                      {list[k].map((item) => {
                        return (
                          <ListItem key={item.url}>
                            <Card size="sm" textAlign="left">
                              <CardBody>
                                <Flex
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Badge
                                    variant="solid"
                                    size="sm"
                                    colorScheme="teal"
                                  >
                                    {item.resourceType}
                                  </Badge>
                                  <Text overflow="hidden">
                                    {getfileName(item.url)}
                                  </Text>
                                  <Box w={120}>
                                    <IconButton
                                      size="sm"
                                      fontSize="12px"
                                      aria-label="download"
                                      boxSize={10}
                                      icon={<DownloadIcon />}
                                      onClick={() => downloadUrl(item)}
                                    />
                                    <IconButton
                                      size="sm"
                                      fontSize="12px"
                                      aria-label="download"
                                      boxSize={10}
                                      icon={<ViewIcon />}
                                      onClick={() => look(item)}
                                    />
                                  </Box>
                                </Flex>
                              </CardBody>
                            </Card>
                          </ListItem>
                        );
                      })}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            );
          })}
        </Box>
        <Box flex="1" bg="" minW={0}>
          {viewItem && <Viewer item={viewItem} />}
        </Box>
      </Flex>
      <Drawer placement="left" onClose={handleClose} isOpen={open}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">All Hosts</DrawerHeader>
          <DrawerBody>
            <List>
              {origins.map((item) => {
                return (
                  <ListItem key={item} p={1} onClick={() => selectOrigin(item)}>
                    <Link>{item}</Link>
                    <Divider />
                  </ListItem>
                );
              })}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </ChakraProvider>
  );
}
