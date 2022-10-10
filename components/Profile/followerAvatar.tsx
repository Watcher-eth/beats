import { useQuery } from "@apollo/client";
import LensAvatar from "components/LensAvatar";
import FollowButton from "components/Profile/FunctionalComponents/FollowButton";
import { CHANNEL_SUBSCRIBERS_QUERY } from "graphql/LEnstube";
import { useMemo } from "react";
import { normalizeUrl } from "lib/media";
import Link from "next/link";
import React, { FC, useState } from "react";
import { useInView } from "react-cool-inview";
import {
  HStack,
  AvatarGroup,
  Avatar,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  SimpleGrid,
  Center,
  Flex,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Follower, PaginatedResultInfo, Profile } from "../../types/index";
import { useRouter } from "next/router";

function FollowerList(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();
  const router = useRouter();
  const id = props.id;
  const { data, loading, fetchMore } = useQuery(CHANNEL_SUBSCRIBERS_QUERY, {
    variables: { request: { profileId: id, limit: 10 } },
    skip: !id,
    onCompleted(data) {
      setPageInfo(data?.followers?.pageInfo);
    },
  });

  if (loading) return <div>loading</div>;
  if (data?.followers?.items?.length === 0)
    return <div className="pt-5">no data founrd</div>;

  if (data) console.log(data);

  return (
    <HStack spacing="10px" p="8px">
      <HStack spacing="10px" borderRadius={"35px"} boxShadow="base" p="8px">
        <motion.div whileHover={{ scale: 1.1 }} onClick={onOpen}>
          <AvatarGroup size="sm" max={3}>
            {data?.followers?.items?.map((item) => {
              return item?.wallet?.defaultProfile?.picture?.original?.url ? (
                <Avatar
                  name={item.wallet.name}
                  src={normalizeUrl(
                    item?.wallet?.defaultProfile.picture?.original?.url
                  )}
                />
              ) : (
                <Avatar />
              );
            })}
          </AvatarGroup>
        </motion.div>

        <Text fontSize="sm">
          {data?.followers?.items[0]?.wallet?.defaultProfile?.name},
          {data?.followers?.items[1]?.wallet?.defaultProfile?.name} following
        </Text>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>{props.name} Followers</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid column={1}>
              {data?.followers?.items.map((item, index) => {
                if (item.wallet?.defaultProfile)
                  return (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Flex
                        m="0.5rem"
                        p="10px"
                        boxShadow={"base"}
                        borderRadius="35px"
                      >
                        <Link
                          href={`/profile/${item?.defaultProfile?.handle}`}
                          key={index}
                        >
                          <a>
                            <HStack>
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 1.1 }}
                              >
                                <LensAvatar
                                  key={index}
                                  profile={item.wallet?.defaultProfile}
                                />
                              </motion.div>

                              <VStack spacing={"1px"}>
                                <Text fontSize={"17px"}>
                                  {item.wallet?.defaultProfile?.name}
                                </Text>
                                <Text fontSize={"13px"} color={"gray.600"}>
                                  {item.wallet?.defaultProfile.handle}
                                </Text>
                              </VStack>
                            </HStack>
                          </a>
                        </Link>
                        <Spacer />
                        <Center p="0 8px">
                          <FollowButton
                            channel={item.wallet?.defaultProfile}
                            id={item.wallet?.defaultProfile.id}
                          />
                        </Center>
                      </Flex>
                    </motion.div>
                  );
              })}
            </SimpleGrid>
          </ModalBody>
          ;
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default FollowerList;
