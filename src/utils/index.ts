export function getExtensionFromUrl(url: string) {
	try {
		// 创建一个 URL 对象
		const urlObject = new URL(url);
		// 获取路径部分并提取文件扩展名
		const pathname = urlObject.pathname;
		return pathname.split(".").pop()?.toLowerCase();
	} catch (error) {
		return "";
	}
}

// 根据url获取文件名
export function getFileNameFromUrl(url: string): string {
	// Create a URL object
	const parsedUrl = new URL(url);
	// Get the pathname from the URL object
	const pathname = parsedUrl.pathname;
	// Extract the file name from the pathname
	const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);
	return fileName;
}

//是否是3D类型
export function is3DFile(url: string) {
	const threeDExtensions = [
		".obj",
		".fbx",
		".stl",
		".dae",
		".3ds",
		".blend",
		".ply",
		".gltf",
		".glb",
	];
	const extension = getExtensionFromUrl(url);
	return threeDExtensions.includes(`.${extension}`);
}

export function isImageFile(url: string) {
	const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
	// Extract the extension from the URL
	const extension = getExtensionFromUrl(url);
	return imageExtensions.includes(`.${extension}`);
}

export function isMediaFile(url: string) {
	const mediaExtensions = [
		".mp3",
		".mp4",
		".avi",
		".mov",
		".mkv",
		".flv",
		".wmv",
		".webm",
	];
	// Extract the extension from the URL
	const extension = getExtensionFromUrl(url);
	return mediaExtensions.includes(`.${extension}`);
}

//是否是音频
export function isAudioUrl(url: string): boolean {
	// 定义常见的音频文件扩展名
	const audioExtensions = ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"];

	try {
		const extension = getExtensionFromUrl(url);

		// 检查文件扩展名是否在音频扩展名列表中
		return extension ? audioExtensions.includes(extension) : false;
	} catch (error) {
		// 如果 URL 无效，返回 false
		return false;
	}
}

// 是否是视频
export function isVideoUrl(url: string): boolean {
	// 定义常见的视频文件扩展名
	const videoExtensions = [
		"mp4",
		"mkv",
		"avi",
		"mov",
		"wmv",
		"flv",
		"webm",
		"mpeg",
		"3gp",
	];

	try {
		const extension = getExtensionFromUrl(url);

		// 检查文件扩展名是否在视频扩展名列表中
		return extension ? videoExtensions.includes(extension) : false;
	} catch (error) {
		// 如果 URL 无效，返回 false
		return false;
	}
}

//是否是js文件
export function isJsFile(url: string) {
	const jsExtensions = [".js"];
	// Extract the extension from the URL
	const extension = getExtensionFromUrl(url);
	return jsExtensions.includes(`.${extension}`);
}

//是否是css文件
export function isCssFile(url: string) {
	const cssExtensions = [".css"];
	// Extract the extension from the URL
	const extension = getExtensionFromUrl(url);
	return cssExtensions.includes(`.${extension}`);
}

//是否是wasm文件
export function isWasmFile(url: string) {
	const wasmExtensions = [".wasm"];
	// Extract the extension from the URL
	const extension = getExtensionFromUrl(url);
	return wasmExtensions.includes(`.${extension}`);
}

// 是否是JSON
export function isJsonFile(url: string) {
	const jsonExtensions = [".json"];
	// Extract the extension from the URL
	const extension = getExtensionFromUrl(url);
	return jsonExtensions.includes(`.${extension}`);
}
