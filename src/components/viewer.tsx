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

  if (isJsFile(item.url) || isCssFile(item.url)) {
    return <Code item={item} />;
  }

  return (
    <div className="w-full h-full text-center">
      <Text className="text-3xl">功能正在发中。。。</Text>
    </div>
  );
};
