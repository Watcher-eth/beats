import React from "react";
import {
  Flex,
  VStack,
  Spacer,
  Text,
  Button,
  Box,
  Avatar,
  HStack,
  Center,
  AvatarGroup,
  Divider,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tabs,
  SimpleGrid,
  Image,
  Input,
} from "@chakra-ui/react";
import TimedAuction from "./CollectModule/TimedAuction";
import Comment from "./Comment";
import TestButton from "./CollectModule/TestButton";
import LikeButton from "./CollectModule/LikeButtonVariant";

function MusicPost() {
  return (
    <Flex direction="column">
      <Center bg={"blackAlpha.200"} width="100%" p="2rem">
        <Image
          src="https://img.seadn.io/files/0fcb5de6b53a894e12de471457e7874e.png?fit=max&w=500"
          boxSize={"500px, 500px"}
          borderRadius="10px"
        ></Image>
      </Center>
      <Flex padding={"2rem"}>
        <Flex direction={"column"}>
          <Text fontSize={"60px"}>Dissapointed</Text>
          <Text fontSize="xl" color={"gray"} m="0 0 1rem 0">
            Posted on Aug 17th
          </Text>
          <HStack>
            <VStack>
              <Text fontSize={"lg"} color="gray.600">
                Collected by
              </Text>
              <AvatarGroup size="sm" max={2}>
                <Avatar
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                />
                <Avatar
                  name="Segun Adebayo"
                  src="https://bit.ly/sage-adebayo"
                />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar
                  name="Prosper Otemuyiwa"
                  src="https://bit.ly/prosper-baba"
                />
                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
              </AvatarGroup>
            </VStack>
            <Divider orientation="vertical" />
            <VStack>
              <HStack spacing={"15"}></HStack>
            </VStack>
          </HStack>
        </Flex>
        <Spacer />
        <Spacer />
        <Flex paddingRight="2rem" direction={"column"}>
          <Flex>
            <VStack spacing="25px">
              <HStack>
                <VStack spacing={"5px"} marginTop="1rem">
                  <Text fontSize={"lg"}>Editions</Text>
                  <Text fontSize="30px">10/100</Text>
                  <Flex
                    w="100%"
                    margin={"0 10px 10px 10px"}
                    boxShadow="base"
                    p="10px"
                    borderRadius="15px"
                  >
                    <Spacer />
                    <Avatar
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                      size="xs"
                      marginRight={"5px"}
                    />
                    <Text fontSize="md">Segun Adebayo</Text>
                  </Flex>
                </VStack>
                <Divider orientation="vertical" />

                <TimedAuction />
              </HStack>

              <TestButton />
            </VStack>
          </Flex>
        </Flex>
      </Flex>

      <Divider />
      <Flex direction={"column"} p="1rem 2rem">
        <Flex>
          <Flex direction="column">
            <Text fontSize={"30px"}>Description</Text>
            <Text fontSize={"lg"}>
              descirpion goes here whe everything is finally said and done This
              is a shorthand for the flex-direction and flex-wrap properties,
              which together define the flex container’s main and cross axes.
              The default value is row nowrap.
            </Text>
          </Flex>

          <Text marginTop={"22px"} fontSize="lg" w="130px">
            Created by
          </Text>
          <Flex
            w="220px"
            h="45px"
            margin={"10px 10px 10px 10px"}
            boxShadow="base"
            p="10px"
            borderRadius="15px"
          >
            <Spacer />
            <Avatar
              name="Segun Adebayo"
              src="https://bit.ly/sage-adebayo"
              size="xs"
              marginRight={"5px"}
            />
            <Text fontSize="md">Segun Adebayo</Text>
          </Flex>
        </Flex>
        <Text fontSize={"lg"} as="b" margin="1rem 0">
          Comments:
        </Text>
        <Input placeholder="Write a comment..."></Input>
        <Comment />
        <Comment />
        <Comment />
      </Flex>
    </Flex>
  );
}

export default MusicPost;
