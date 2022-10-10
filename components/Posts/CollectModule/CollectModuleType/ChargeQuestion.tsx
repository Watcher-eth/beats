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

const ChargeQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <Box m="2rem">
      <Divider orientation="horizontal" bg={"black"} m="15px 0" />
      <Text fontSize={"20px"} m="0.5rem">
        Would you like to charge user?
      </Text>
      <HStack className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            bg={"white"}
            boxShadow="base"
            borderRadius="25px"
            type="button"
            onClick={() =>
              setCollectType({
                isFreeCollect: true,
                isFeeCollect: false,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500": uploadedVideo.collectModule.isFreeCollect,
              }
            )}
          >
            <Text color={"black"}>Mint for Free</Text>
            {uploadedVideo.collectModule.isFreeCollect && <AiOutlineCheck />}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            borderRadius="25px"
            bg={"gray.800"}
            type="button"
            onClick={() =>
              setCollectType({
                isFreeCollect: false,
                isFeeCollect: true,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500": uploadedVideo.collectModule.isFeeCollect,
              }
            )}
          >
            <Text color="white">Yes, Some Amount</Text>
            {uploadedVideo.collectModule.isFeeCollect && <AiOutlineCheck />}
          </Button>
        </motion.div>
      </HStack>
    </Box>
  );
};

export default ChargeQuestion;
