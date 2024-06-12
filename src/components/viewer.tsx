import { Box, Center, Image, Text } from "@chakra-ui/react";
import { is3DFile, isImageFile, isMediaFile } from "../utils";
import { TResource } from "../types";
import { Model3D } from "./model-3d";

export const Viewer = ({ item }: { item: TResource }) => {
  if (is3DFile(item.url)) {
    return (
      <Box width="100%" height="100%">
        <Model3D item={item} />
      </Box>
    );
  }
  if (isImageFile(item.url)) {
    return (
      <Box width="100%" height="100%">
        <Image src={item.url} width={"100%"} alt="look imgage" />
      </Box>
    );
  }
  // if (isMediaFile(item.url)) {
  //   return <Box>Media</Box>;
  // }

  return <Center>
    <Text fontSize='4xl'>功能正在发中。。。</Text>
  </Center>;
};
