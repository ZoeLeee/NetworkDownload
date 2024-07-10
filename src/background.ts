import { FileMap, TResourceType } from "./types";
import { getFileNameFromUrl, is3DFile, isImageFile } from "./utils";
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
				width: 1340,
				height: 960,
				// left: (tab.width - 800) * 0.5,
				// top: (tab.height - 800) * 0.5,
			},
			(win) => {
				console.log("ok");
			},
		);
	});
});

const UrlMap: Record<string, FileMap> = {};

chrome.webRequest.onBeforeRequest.addListener(
	(details) => {
		let arr = UrlMap[details.initiator] as FileMap;

		const parsedUrl = new URL(details.url);

		if (!arr) {
			arr = {};
			if (details.initiator) {
				UrlMap[parsedUrl.origin] = arr;
			}
		}

		const fileName = getFileNameFromUrl(details.url);

		if (!fileName.includes(".")) return;

		const origin = parsedUrl.origin;
		const path = parsedUrl.pathname;
		const directory = path.substring(0, path.lastIndexOf("/") + 1);

		let list = arr[directory];

		if (!list) {
			list = [];
			arr[directory] = list;
		}

		if (!list.some((a) => a.url === details.url)) {
			let type: TResourceType = "Other";
			if (is3DFile(details.url)) {
				type = "3D";
			} else if (isImageFile(details.url)) {
				type = "Image";
			} else {
				//
			}

			list.push({
				...details,
				resourceType: type,
			});
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("sender: ", sender);

	if (message.type === "get-data") {
		if (message.data.tabId) {
			getActivaTab(message.data.tabId).then((tab) => {
				const origin = new URL(tab.url).origin;
				chrome.runtime.sendMessage({
					type: "send-data",
					origin: origin,
					data: UrlMap[origin],
				});
			});
		} else if (message.data.origin) {
			chrome.runtime.sendMessage({
				type: "send-data",
				origin: message.data.origin,
				data: UrlMap[message.data.origin],
			});
		}
	} else if (message.type === "get-origins") {
		chrome.runtime.sendMessage({
			type: "send-origins",
			origin: origin,
			data: Object.keys(UrlMap).filter((item) => item.startsWith("http")),
		});
	}
});
