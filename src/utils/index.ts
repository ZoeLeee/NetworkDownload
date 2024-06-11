
// 根据url获取文件名
export function getFileNameFromUrl(url: string): string {
    // Create a URL object
    const parsedUrl = new URL(url);
    // Get the pathname from the URL object
    const pathname = parsedUrl.pathname;
    // Extract the file name from the pathname
    const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
    return fileName;
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
