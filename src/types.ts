export type FileMap = Record<string, TResource[]>;

export type TResourceType = "3D" | "Image" | "Media" | "Other" | "Wasm";

export type TResource = chrome.webRequest.WebRequestBodyDetails & {
	resourceType: TResourceType;
};
