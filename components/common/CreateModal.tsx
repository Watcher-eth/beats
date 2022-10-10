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
  SkeletonCircle,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { useProfile } from "../../context/context";
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from "next/link"

export default function CreateModal() {
  const { profile } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <motion.div layout onClick={onOpen}>
      <motion.h2 layout>
        <Center>
          <Box>
            <Center>
              <Button colorScheme={"blue"} borderRadius={"25px"}>
                Create
              </Button>
            </Center>
          </Box>
        </Center>
      </motion.h2>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent p="0.5rem" borderRadius={"35px"} top="100px">
          <ModalHeader>
            <Center>
              <VStack>
                <Text fontSize={"35px"}>Create</Text>
                <Text fontSize={"17px"} color={"gray.800"}>
                  All our Posts are stored as NFTs on the Polygon Blockchain.
                  Your data is stored permantly & decentralized on Arweave.
                </Text>
              </VStack>
            </Center>
            <ModalCloseButton m="12px" />
          </ModalHeader>
          <ModalBody>
            <HStack
              spacing={"20px"}
              top="200px"
              right={"30px"}
              p="0 15px 15px 15px"
            >
                <Link href="/createShort">
                <a>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button minH="250px" minW="300px" borderRadius={"35px"}>
                  <VStack spacing="10px">
                    <Text fontSize={"25"}>Create a Post</Text>
                    <Text fontSize={"17"} color="gray.700" p="0 0 3px 0">
                      Write what ever is on your mind
                    </Text>
                    <Stack
                      w="100%"
                      boxShadow={"lg"}
                      p="10px"
                      borderRadius={"15px"}
                      bg="white"
                    >
                      <SkeletonCircle size={10} />
                      <Skeleton height="10px" w="200px" />
                      <Skeleton height="10px" />
                      <Skeleton height="10px" w="200px" />
                    </Stack>
                  </VStack>
                </Button>
              </motion.div>
              </a>
              </Link>
              <Link href="/createSnippet">
                <a>
                  <motion.div whileHover={{ scale: 1.03 }}>
                    <Button minH="250px" minW="300px" borderRadius={"35px"}>
                      <VStack spacing="10px">
                        <Text fontSize={"25"}>Create a Snippet</Text>
                        <Text fontSize={"17"} color="gray.700" p="0 0 3px 0">
                          Short audio snippets (max 60s)
                        </Text>

                        <Stack
                          w="100%"
                          boxShadow={"lg"}
                          p="10px"
                          borderRadius={"15px"}
                          bg="white"
                     
                        >
                          <HStack spacing={"4px"}>
                            <SkeletonCircle size={5} />
                            <Skeleton height="7px" w="60px" />
                          </HStack>
                          <HStack spacing={"4px"} alignSelf="center">
                            <Skeleton height="40px" w="5px" />
                            <Skeleton height="30px" w="5px" />
                            <Skeleton height="37px" w="5px" />
                            <Skeleton height="28px" w="5px" />
                            <Skeleton height="32px" w="5px" />
                            <Skeleton height="39px" w="5px" />
                            <Skeleton height="34px" w="5px" />
                            <Skeleton height="26px" w="5px" />
                            <Skeleton height="29px" w="5px" />
                            <Skeleton height="33px" w="5px" />
                            <Skeleton height="39px" w="5px" />
                            <Skeleton height="40px" w="5px" />
                            <Skeleton height="30px" w="5px" />
                            <Skeleton height="37px" w="5px" />
                            <Skeleton height="28px" w="5px" />
                            <Skeleton height="32px" w="5px" />
                            <Skeleton height="39px" w="5px" />
                            <Skeleton height="34px" w="5px" />
                            <Skeleton height="26px" w="5px" />
                            <Skeleton height="29px" w="5px" />
                            <Skeleton height="33px" w="5px" />
                            <Skeleton height="26px" w="5px" />
                            <Skeleton height="29px" w="5px" />
                            <Skeleton height="33px" w="5px" />
                            <Skeleton height="39px" w="5px" />
                          </HStack>
                        </Stack>
                      </VStack>
                    </Button>
                  </motion.div>
                </a>
              </Link>
              <Link href="/create">
                <a>
                  <motion.div whileHover={{ scale: 1.03 }}>
                    <Button minH="250px" minW="300px" borderRadius={"35px"}>
                      <VStack spacing="10px">
                        <Text fontSize={"25"}>Create a Beat</Text>
                        <Text fontSize={"17"} color="gray.700" p="0 0 3px 0">
                          Full feautured song
                        </Text>

                        <Stack
                          w="100%"
                          boxShadow={"lg"}
                          p="10px"
                          borderRadius={"15px"}
                          bg="white"
                   
                        >
                          <HStack spacing={"4px"} alignSelf="center">
                            <Skeleton
                              height="70px"
                              w="70px "
                              m="0 3px 0 0"
                              borderRadius={"8px"}
                            />
                            <Skeleton height="40px" w="3px" />
                            <Skeleton height="30px" w="3px" />
                            <Skeleton height="37px" w="3px" />
                            <Skeleton height="28px" w="3px" />
                            <Skeleton height="32px" w="3px" />
                            <Skeleton height="39px" w="3px" />
                            <Skeleton height="34px" w="3px" />
                            <Skeleton height="26px" w="3px" />
                            <Skeleton height="29px" w="3px" />
                            <Skeleton height="33px" w="3px" />
                            <Skeleton height="26px" w="3px" />
                            <Skeleton height="31px" w="3px" />
                            <Skeleton height="33px" w="3px" />
                            <Skeleton height="26px" w="3px" />
                            <Skeleton height="29px" w="3px" />
                            <Skeleton height="36px" w="3px" />
                            <Skeleton height="29px" w="3px" />
                            <Skeleton height="33px" w="3px" />
                            <Skeleton height="26px" w="3px" />
                            <Skeleton height="29px" w="3px" />
                            <Skeleton height="33px" w="3px" />
                            <Skeleton height="35px" w="3px" />
                            <Skeleton height="31px" w="3px" />
                            <Skeleton height="38px" w="3px" />
                          </HStack>
                        </Stack>
                      </VStack>
                    </Button>
                  </motion.div>
                </a>
              </Link>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
