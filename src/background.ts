import { getActivaTab } from "./utils/message";

const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log("Default background color set to %cgreen", `color: ${color}`);
});



chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true }, (tabs) => {

        // 创建窗口
        chrome.windows.create(
            {
                url: chrome.runtime.getURL(`index.html?contentId=${tabs[0]?.id}`),
                type: "popup",
                height: 800,
                width: 800,
                // left: (tab.width - 800) * 0.5,
                // top: (tab.height - 800) * 0.5,
            },
            (win) => {
                console.log("ok");
            }
        );
    });
});

const UrlMap = new Map<string, chrome.webRequest.WebRequestBodyDetails[]>()

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log('details: ', details);

        let arr = UrlMap.get(details.initiator)

        if (!arr) {
            arr = []
            if (details.initiator) {
                UrlMap.set(new URL(details.initiator).origin, arr)
            }
        }

        if (!arr.some(a => a.url === details.url)) {
            arr.push(details)
        }
        // {
        //     "documentId": "95F723C4FDD23C07E2533208C07F97A0",
        //     "documentLifecycle": "active",
        //     "frameId": 57,
        //     "frameType": "sub_frame",
        //     "initiator": "https://accounts.google.com",
        //     "method": "POST",
        //     "parentDocumentId": "0239E48F4270DDDA5D79952496110450",
        //     "parentFrameId": 0,
        //     "requestId": "4052",
        //     "tabId": 1877247100,
        //     "timeStamp": 1716105732296.895,
        //     "type": "xmlhttprequest",
        //     "url": "https://accounts.google.com/RotateCookies"
        // }
        // 在这里处理请求，可以修改、重定向或阻止它
    },
    { urls: ["<all_urls>"] }, // 匹配所有网址
);


// 在 background 页面中监听来自 popup 页面的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('sender: ', sender);

    if (message.type === "get-data") {
        getActivaTab(message.data.origin).then(tab => {
            console.log('UrlMap: ', UrlMap);
            console.log(tab);
            chrome.runtime.sendMessage({ type: "send-data", data: UrlMap.get(new URL(tab.url).origin) });
        })
    }
});