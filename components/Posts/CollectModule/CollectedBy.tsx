import React from "react";
import {
  VStack,
  Text,
  Avatar,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Center,
  Flex,
  HStack,
  SimpleGrid,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import WHO_COLLECTED from "graphql/publications/who-collected-request";
import { normalizeUrl, resolveImageUrl } from "lib/media";
import LensAvatar from "components/LensAvatar";
import { motion } from "framer-motion";
import FollowButton from "components/Profile/FunctionalComponents/FollowButton";
import Link from "next/link";
function CollectedBy(props) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const id = props.id;
  const { data, loading, error } = useQuery(WHO_COLLECTED, {
    variables: { id },
    skip: !props.id,
  });
  if (loading) return <div>Currently loading</div>;

  if (error) return <div>erorr</div>;

  return (
    <div>
      {data?.whoCollectedPublication?.items[0]?.defaultProfile?.picture
        ?.original?.url && (
        <HStack spacing={"2px"} p="4px" borderRadius="18px" m="15px 0">
          <motion.div whileHover={{ scale: 1.03 }} onClick={onOpen}>
            <AvatarGroup size="sm" max={3}>
              {data.whoCollectedPublication.items.map((item, index) => {
                return (
                  <Avatar
                    key={index}
                    name={item?.defaultProfile?.handle}
                    src={normalizeUrl(
                      item?.defaultProfile?.picture?.original?.url
                    )}
                  />
                );
              })}
            </AvatarGroup>
          </motion.div>

          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent>
              <ModalHeader>
                <Center>Collectors</Center>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid column={1}>
                  {data?.whoCollectedPublication?.items.map((item, index) => {
                    if (item.defaultProfile)
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
                                      profile={item?.defaultProfile}
                                    />
                                  </motion.div>

                                  <VStack spacing={"1px"}>
                                    <Text fontSize={"17px"}>
                                      {item?.defaultProfile?.name}
                                    </Text>
                                    <Text fontSize={"13px"} color={"gray.600"}>
                                      {item?.defaultProfile?.handle}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </a>
                            </Link>
                            <Spacer />
                            <Center p="0 8px">
                              <FollowButton channel={item?.defaultProfile} />
                            </Center>
                          </Flex>
                        </motion.div>
                      );
                  })}
                </SimpleGrid>
              </ModalBody>
            </ModalContent>
          </Modal>
        </HStack>
      )}
    </div>
  );
}

export default CollectedBy;
