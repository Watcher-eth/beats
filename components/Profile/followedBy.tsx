import React from "react";
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
import { useQuery, gql } from "@apollo/client";
import { MUTUAL_SUBSCRIBERS_QUERY } from "../../graphql/LEnstube";
import { useRouter } from "next/router";
import { useProfile } from "../../context/context";
import { normalizeUrl } from "lib/media";
import FollowerList from "./followerAvatar";
import { motion } from "framer-motion";
import LensAvatar from "components/LensAvatar";
import FollowButton from "components/Profile/FunctionalComponents/FollowButton";
import Link from "next/link";

const FETCH_COUNT = 4;

function FollowedBy(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { profile } = useProfile();
  const id = props.id;
  const { data, loading, error } = useQuery(MUTUAL_SUBSCRIBERS_QUERY, {
    variables: {
      request: {
        viewingProfileId: id,
        yourProfileId: profile?.id,
        limit: FETCH_COUNT,
      },
    },
    skip: !id || !profile?.id,
  });

  if (loading) return <div>Currently loading</div>;

  if (error) return <div>Something went wrong </div>;
  console.log(data);

  if (!data) return <FollowerList name={props.name} id={id} />;
  if (data.mutualFollowersProfiles.items.length === 0)
    return <FollowerList name={props.name} id={id} />;

  return (
    <HStack spacing="10px">
      <motion.div whileHover={{ scale: 1.03 }} onClick={onOpen}>
        <HStack borderRadius={"35px"} spacing="5px">
          <motion.div whileHover={{ scale: 1.03 }} onClick={onOpen}>
            <AvatarGroup size="sm" max={3}>
              {data.mutualFollowersProfiles.items.map((item) => {
                return (
                  <Avatar
                    name={item.name}
                    src={normalizeUrl(item.picture?.original?.url)}
                  />
                );
              })}
            </AvatarGroup>
          </motion.div>
          <Text fontSize="sm" m="15px">
            are following
          </Text>
        </HStack>
      </motion.div>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>
            <Center>Mutual Followers</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid column={1}>
              {data.mutualFollowersProfiles.items.map((item, index) => {
                if (item)
                  return (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Flex
                        m="0.5rem"
                        p="10px"
                        boxShadow={"base"}
                        borderRadius="35px"
                      >
                        <Link href={`/profile/${item?.handle}`} key={index}>
                          <a>
                            <HStack>
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 1.1 }}
                              >
                                <LensAvatar key={index} profile={item} />
                              </motion.div>

                              <VStack spacing={"1px"}>
                                <Text fontSize={"17px"}>{item?.name}</Text>
                                <Text fontSize={"13px"} color={"gray.600"}>
                                  {item?.handle}
                                </Text>
                              </VStack>
                            </HStack>
                          </a>
                        </Link>
                        <Spacer />
                        <Center p="0 8px">
                          <FollowButton channel={item} id={item?.id} />
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
  );
}

export default FollowedBy;
