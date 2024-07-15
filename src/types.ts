export type FileMap = Record<string, TResource[]>;

export type TResourceType =
	| "3D"
	| "Image"
	| "Media"
	| "Other"
	| "wasm"
	| "js"
	| "css"
	| "json";

export type TResource = chrome.webRequest.WebRequestBodyDetails & {
	resourceType: TResourceType;
};
