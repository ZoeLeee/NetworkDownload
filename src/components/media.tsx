import React from "react";
import { TResource } from "../types";
import { isAudioUrl, isVideoUrl } from "../utils";

export const Media = ({ item }: { item: TResource }) => {
  if (isAudioUrl(item.url)) {
    return <audio src={item.url} controls></audio>;
  }

  if (isVideoUrl(item.url)) {
    return <video src={item.url} controls></video>;
  }

  return <div>暂不不支持</div>;
};
