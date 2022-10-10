import { Box, Button, HStack, Text, Divider } from "@chakra-ui/react";
import clsx from "clsx";
import React, { FC } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { CollectModuleType, UploadedPost } from "../../../../types/local";
import { motion } from "framer-motion";
type Props = {
  uploadedVideo: UploadedPost;
  // eslint-disable-next-line no-unused-vars
  setCollectType: (data: CollectModuleType) => void;
};

const PermissionQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <Box className="space-y-2" m="0.5rem">
      <Text fontSize={"20px"} m="0.5rem">
        Who can collect this publication?
      </Text>
      <HStack className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            borderRadius="25px"
            bg={"white"}
            boxShadow="base"
            type="button"
            onClick={() =>
              setCollectType({
                isFreeCollect: true,
                isRevertCollect: false,
                isFeeCollect: false,
                followerOnlyCollect: false,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500":
                  !uploadedVideo.collectModule.followerOnlyCollect &&
                  !uploadedVideo.collectModule.isRevertCollect,
              }
            )}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Text>Anyone</Text>
            </motion.div>
            {!uploadedVideo.collectModule.followerOnlyCollect &&
              !uploadedVideo.collectModule.isRevertCollect && (
                <AiOutlineCheck />
              )}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            borderRadius="25px"
            bg={"gray.800"}
            type="button"
            onClick={() =>
              setCollectType({
                followerOnlyCollect: true,
                isRevertCollect: false,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500":
                  uploadedVideo.collectModule.followerOnlyCollect &&
                  !uploadedVideo.collectModule.isRevertCollect,
              }
            )}
          >
            <Text color={"white"}>Subscribers</Text>
            {uploadedVideo.collectModule.followerOnlyCollect &&
              !uploadedVideo.collectModule.isRevertCollect && (
                <AiOutlineCheck />
              )}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            borderRadius="25px"
            colorScheme={"blackAlpha"}
            type="button"
            onClick={() =>
              setCollectType({
                isRevertCollect: true,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500":
                  uploadedVideo.collectModule.isRevertCollect,
              }
            )}
          >
            <Text>Nobody</Text>
            {uploadedVideo.collectModule.isRevertCollect && <AiOutlineCheck />}
          </Button>
        </motion.div>
      </HStack>
    </Box>
  );
};

export default PermissionQuestion;
