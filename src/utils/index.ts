export * from "./message"

// 根据url获取文件名
export function getFileNameFromUrl(url) {
    // 使用正则表达式从 URL 中提取文件名
    var matches = url.match(/\/([^\/?#]+)$/);
    if (matches && matches.length > 1) {
        return matches[1]; // 返回匹配到的文件名
    } else {
        return null; // 如果未匹配到文件名，返回 null
    }
}

//是否是3D类型
export function is3DFile(url:string) {
    const threeDExtensions = ['.obj', '.fbx', '.stl', '.dae', '.3ds', '.blend', '.ply', '.gltf', '.glb'];
    // Extract the extension from the URL
    const extension = url.split('.').pop()?.toLowerCase();
    return threeDExtensions.includes(`.${extension}`);
}

export function isImageFile(url:string) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    // Extract the extension from the URL
    const extension = url.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(`.${extension}`);
}

export function isMediaFile(url:string) {
    const mediaExtensions = ['.mp3', '.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm'];
    // Extract the extension from the URL
    const extension = url.split('.').pop()?.toLowerCase();
    return mediaExtensions.includes(`.${extension}`);
}
