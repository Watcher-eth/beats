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

const LimitDurationQuestion: FC<Props> = ({
  uploadedVideo,
  setCollectType,
}) => {
  return (
    <Box m="2rem" className="space-y-2">
      <Divider orientation="horizontal" bg={"black"} m="15px 0" />
      <Text fontSize={"20px"} m="0.5rem">
        Would you like to limit the mint duration?
      </Text>
      <HStack className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <motion.div whileHover={{ scale: 1.08 }}>
          <Button
            borderRadius="25px"
            bg={"white"}
            boxShadow="base"
            type="button"
            onClick={() =>
              setCollectType({
                isTimedFeeCollect: false,
                isFeeCollect: false,
                isFreeCollect: uploadedVideo.collectModule.isLimitedFeeCollect
                  ? false
                  : true,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500":
                  !uploadedVideo.collectModule.isTimedFeeCollect,
              }
            )}
          >
            <Text>Unlimited</Text>
            {!uploadedVideo.collectModule.isTimedFeeCollect && (
              <AiOutlineCheck />
            )}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.08 }}>
          <Button
            borderRadius="25px"
            bg={"gray.800"}
            type="button"
            onClick={() =>
              setCollectType({
                isTimedFeeCollect: true,
                isLimitedFeeCollect: uploadedVideo.collectModule
                  .isLimitedFeeCollect
                  ? true
                  : false,
                isFeeCollect: true,
                isFreeCollect: false,
              })
            }
            className={clsx(
              "flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl",
              {
                "!border-indigo-500":
                  uploadedVideo.collectModule.isTimedFeeCollect,
              }
            )}
          >
            <Text color={"white"}>Limit collects to 24 hours </Text>
            {uploadedVideo.collectModule.isTimedFeeCollect && (
              <AiOutlineCheck />
            )}
          </Button>
        </motion.div>
      </HStack>
    </Box>
  );
};

export default LimitDurationQuestion;
