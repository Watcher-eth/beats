import { LayoutGroup, motion } from "framer-motion";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Center,
  Divider,
  HStack,
  Text,
  VStack,
  Flex,
  Button,
  IconButton,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useProfile } from "../../context/context";
import { normalizeUrl } from "../../lib/media";
import { useQuery } from "@apollo/client";

import { IoMdNotificationsOutline } from "react-icons/io";
import {
  NOTIFICATION_COUNT_QUERY,
  NOTIFICATIONS_QUERY,
} from "../../graphql/LEnstube";
import logger from "../../lib/logger";
import useAppStore from "../../lib/store";
import usePersistStore from "../../lib/store/persist";
import { LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID } from "../../lib/constants";
import clsx from "clsx";
import { useEffect } from "react";
import { useInView } from "react-cool-inview";
import { Notification, PaginatedResultInfo } from "../../types";
import LensAvatar from "components/LensAvatar";
import Link from "next/link";
import Image from "next/image";
const request = {
  limit: 20,
  customFilters: LENS_CUSTOM_FILTERS,
};

export default function Notifications() {
  const { profile } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(profile);

  const setNotificationCount = usePersistStore(
    (state) => state.setNotificationCount
  );
  const selectedChannel = profile;

  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();

  const { data: notificationsCountData } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        customFilters: LENS_CUSTOM_FILTERS,
      },
    },
    skip: !selectedChannel?.id,
  });

  const { data, loading, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        ...request,
      },
    },
    onCompleted(data) {
      setPageInfo(data?.notifications?.pageInfo);
      setNotifications(data?.notifications?.items);
      setTimeout(() => {
        const totalCount =
          notificationsCountData?.notifications?.pageInfo?.totalCount;
        setNotificationCount(totalCount ?? 0);
        setHasNewNotification(false);
      }, 1000);
    },
  });

  const { observe } = useInView({
    rootMargin: "1000px 0px",
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              profileId: selectedChannel?.id,
              cursor: pageInfo?.next,
              ...request,
            },
          },
        });
        setPageInfo(data?.notifications?.pageInfo);
        setNotifications([...notifications, ...data?.notifications?.items]);
      } catch (error) {
        logger.error("[Error Fetch Notifications]", error);
      }
    },
  });

  if (loading) return <div>loading</div>;
  console.log(data);
  console.log(notifications);

  return (
    <motion.div layout onClick={onOpen}>
      <motion.h2 layout>
        <Center>
          <Box>
            <Center>
              <IconButton
                variant={"ghost"}
                aria-label={"Notifications"}
                icon={<IoMdNotificationsOutline />}
              />
            </Center>
          </Box>
        </Center>
      </motion.h2>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent p="5px" borderRadius="15px">
          <ModalHeader>
            <Center>
              <Text fontSize={"25px"}>Notifications</Text>
            </Center>
            <ModalCloseButton m="10px" />
          </ModalHeader>
          <ModalBody>
            <VStack spacing={"1px"} right={"30px"}>
              {data?.notifications?.items?.map((item, index) => {
                const date = new Date(item.createdAt);
                if (item?.__typename === "NewCommentNotification")
                  return (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <HStack
                        m="0rem 0 0 0rem"
                        p="10px"
                        w="400px"
                        boxShadow={"base"}
                        borderRadius={"15px"}
                        spacing={"2px"}
                      >
                        {item?.__typename === "NewCommentNotification" && (
                          <HStack>
                            <LensAvatar profile={item?.profile} />
                            <Text>{item?.profile?.handle} commented:</Text>
                            <Text>{item?.comment?.metadata?.content}</Text>
                          </HStack>
                        )}
                      </HStack>
                    </motion.div>
                  );

                if (item?.__typename === "NewFollowerNotification")
                  return (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      {item.wallet.defaultProfile?.handle && (
                        <HStack
                          m="2rem 0 0 0rem"
                          p="10px"
                          w="400px"
                          boxShadow={"base"}
                          borderRadius={"15px"}
                          spacing={"2px"}
                        >
                          <HStack>
                            <HStack>
                              <Link
                                href={`/profile/${item?.wallet?.defaultProfile?.handle}`}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 1.11 }}
                                >
                                  <LensAvatar
                                    profile={item?.wallet?.defaultProfile}
                                  />
                                </motion.div>
                              </Link>
                              <Text>
                                {item?.wallet?.defaultProfile?.handle} followed
                                you
                              </Text>
                            </HStack>
                          </HStack>
                        </HStack>
                      )}
                    </motion.div>
                  );
                if (item?.__typename === "NewMentionNotification")
                  return (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <HStack
                        m="2rem 0 0 0rem"
                        p="10px"
                        w="400px"
                        boxShadow={"base"}
                        borderRadius={"15px"}
                        spacing={"2px"}
                      >
                        {item?.__typename === "NewMentionNotification" && (
                          <HStack>
                            <Link href={`/post/${item?.profile?.id}`}>
                              <LensAvatar profile={item?.profile} />

                              <Text>{item?.profile?.handle} mentioned you</Text>
                            </Link>
                          </HStack>
                        )}
                      </HStack>
                    </motion.div>
                  );

                if (item?.__typename === "NewReactionNotification")
                  return (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <HStack
                        m="2rem 0 0 0rem"
                        p="10px"
                        w="400px"
                        boxShadow={"base"}
                        borderRadius={"15px"}
                        spacing={"2px"}
                      >
                        {item?.__typename === "NewReactionNotification" && (
                          <Link href={`/post/${item?.publication?.id}`}>
                            <HStack>
                              <LensAvatar
                                profile={item?.profile}
                                height={50}
                                width={50}
                              />
                              <Flex direction={"column"}>
                                <HStack>
                                  {" "}
                                  <Text>{item?.profile?.handle} liked</Text>
                                  <motion.div whileHover={{ scale: 1.04 }}>
                                    <Link
                                      href={`/post/${item?.publication?.id}`}
                                    >
                                      <Text color={"gray.600"}>your Post</Text>
                                    </Link>
                                  </motion.div>
                                </HStack>
                                <Text noOfLines={2} overflow="hidden">
                                  {item?.publication?.metadata?.content}
                                </Text>
                              </Flex>
                            </HStack>
                          </Link>
                        )}
                      </HStack>
                    </motion.div>
                  );
              })}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
