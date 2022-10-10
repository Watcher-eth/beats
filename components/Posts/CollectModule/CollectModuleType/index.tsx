import {
  Box,
  Button,
  VStack,
  Text,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
} from "@chakra-ui/react";

import useAppStore from "../../../../lib/store";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { CollectModuleType } from "../../../../types/local";
import { motion } from "framer-motion";
import ChargeQuestion from "./ChargeQuestion";
import FeeCollectForm from "./FeeCollectForm";
import LimitDurationQuestion from "./LimitDurationQuestion";
import LimitQuestion from "./LimitQuestion";
import PermissionQuestion from "./PermissionQuestion";

const CollectModuleType = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const uploadedVideo = useAppStore((state) => state.uploadedPost);
  const setUploadedVideo = useAppStore((state) => state.setUploadedPost);

  const setCollectType = (data: CollectModuleType) => {
    setUploadedVideo({
      collectModule: { ...uploadedVideo.collectModule, ...data },
    });
  };

  const getSelectedCollectType = () => {
    const followerOnlyCollect = uploadedVideo.collectModule.followerOnlyCollect;
    const isTimedFeeCollect = uploadedVideo.collectModule.isTimedFeeCollect;
    const isLimitedFeeCollect = uploadedVideo.collectModule.isLimitedFeeCollect;
    const collectLimit = uploadedVideo.collectModule.collectLimit;
    if (uploadedVideo.collectModule.isRevertCollect) {
      return "No one can mint this publication";
    }
    if (uploadedVideo.collectModule.isFreeCollect) {
      return `${
        followerOnlyCollect ? "Only Subscribers" : "Anyone"
      } can mint for free ${isTimedFeeCollect ? "within 24hrs" : ""}`;
    }
    if (!uploadedVideo.collectModule.isFreeCollect) {
      return `${followerOnlyCollect ? "Only Subscribers" : "Anyone"} can mint ${
        isLimitedFeeCollect ? `maximum of ${collectLimit}` : ""
      } for given fees ${isTimedFeeCollect ? "within 24hrs" : ""}`;
    }
  };

  return (
    <VStack align={"center"} alignItems={"center"} justify={"center"}>
      <Box
        className="flex items-center mb-1 space-x-1.5"
        alignItems={"center"}
        justifyContent={"center"}
      >
    
      </Box>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Button
          borderRadius="25px"
          type="button"
          colorScheme={"blue"}
          onClick={onOpen}
          className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-200 focus:outline-none dark:border-gray-800 rounded-xl"
        >
          <Text>{getSelectedCollectType()}</Text>
          <AiOutlineCheck />
        </Button>
      </motion.div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <Text alignSelf={"center"} color={"gray.700"} fontSize="25px">
                Choose your Collect Module
              </Text>
            </Center>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <VStack className="mt-2 space-y-4" spacing={"5px"}>
              <PermissionQuestion
                setCollectType={setCollectType}
                uploadedVideo={uploadedVideo}
              />

              {!uploadedVideo.collectModule.isRevertCollect && (
                <LimitDurationQuestion
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                />
              )}

              {!uploadedVideo.collectModule.isRevertCollect && (
                <LimitQuestion
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                />
              )}

              {!uploadedVideo.collectModule.isRevertCollect &&
                !uploadedVideo.collectModule.isTimedFeeCollect &&
                !uploadedVideo.collectModule.isLimitedFeeCollect && (
                  <ChargeQuestion
                    setCollectType={setCollectType}
                    uploadedVideo={uploadedVideo}
                  />
                )}

              {!uploadedVideo.collectModule.isFreeCollect &&
              !uploadedVideo.collectModule.isRevertCollect ? (
                <FeeCollectForm
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 1.07 }}
                  className="flex justify-end"
                >
                  <Button
                    borderRadius="25px"
                    colorScheme={"teal"}
                    color={"white"}
                    m="25px 0"
                    onClick={onClose}
                  >
                    Set Collect Type
                  </Button>
                </motion.div>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default CollectModuleType;
