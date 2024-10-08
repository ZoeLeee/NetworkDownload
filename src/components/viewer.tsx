import {
  is3DFile,
  isCssFile,
  isImageFile,
  isJsFile,
  isMediaFile,
} from "../utils";
import { TResource } from "../types";
import { Model3D } from "./model-3d";
import { Text } from "./text";
import { Image } from "primereact/image";
import { Media } from "./media";
import { Code } from "./code";
import { WasmViewer } from "./wasm";

export const Viewer = ({ item }: { item: TResource }) => {
  if (is3DFile(item.url)) {
    return (
      <div className="w-full h-full">
        <Model3D item={item} />
      </div>
    );
  }
  if (isImageFile(item.url)) {
    return (
      <div className="w-full h-full">
        <Image src={item.url} width={"100%"} alt="look imgage" />
      </div>
    );
  }
  if (isMediaFile(item.url)) {
    return <Media item={item} />;
  }

  if (["js", "css", "json"].includes(item.resourceType)) {
    return <Code item={item} />;
  }

  // if (item.resourceType === "wasm") {
  //   return <WasmViewer item={item} />;
  // }

  return (
    <div className="w-full h-full text-center">
      <Text className="text-3xl">功能正在发中。。。</Text>
    </div>
  );
};
