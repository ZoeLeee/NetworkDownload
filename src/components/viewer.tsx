import { Box, Image } from "@chakra-ui/react";
import { is3DFile, isImageFile, isMediaFile } from "../utils";
import { TResource } from "../types";

export const Viewer = ({ item }: { item: TResource }) => {
  if (is3DFile(item.url)) {
    return <Box>3D</Box>;
  }
  if (isImageFile(item.url)) {
    return (
      <Box width="100%" height="100%">
        <Image src={item.url} width={"100%"} alt="look imgage" />
      </Box>
    );
  }
  if (isMediaFile(item.url)) {
    return <Box>Media</Box>;
  }

  return <Box></Box>;
};
