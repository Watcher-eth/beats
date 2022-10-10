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
} from "@chakra-ui/react";
import ProfileFeed from "./ProfileFeed";

function Profile() {
  return (
    <Flex w="100%" h="100%" direction={"column"}>
      <Flex w="100%" h="17rem" bg={"black"} direction="column" p="8rem">
        <Spacer />
        <Avatar w="150px" h="150px" src="https://bit.ly/ryan-florence" />
      </Flex>
      <Flex w="100%">
        <VStack spacing="14px" margin={"2rem"} justify="start">
          <VStack spacing="1px">
            <Text fontSize={"2xl"}>KarmaWav</Text>

            <Text fontSize={"md"} color="darkGray">
              karmawav.lens
            </Text>
          </VStack>
          <HStack spacing="5px">
            <VStack spacing="2px">
              <HStack spacing="55px">
                <Text fontSize="2xl">268</Text>
                <Text fontSize="2xl">154</Text>
              </HStack>
              <HStack spacing="35px">
                <Text fontSize="md" marginLeft={"10px"}>
                  Followers
                </Text>
                <Text fontSize="md" marginRight={"10px"}>
                  Following
                </Text>
              </HStack>
            </VStack>
            <Button w="10rem" h="3rem" borderRadius={"45px"} boxShadow="base">
              Follow
            </Button>
          </HStack>
          <Divider orientation="horizontal" />
          <HStack spacing="10px" borderRadius={"35px"} boxShadow="base" p="8px">
            <AvatarGroup size="sm" max={2}>
              <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
              <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
              <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
              <Avatar
                name="Prosper Otemuyiwa"
                src="https://bit.ly/prosper-baba"
              />
              <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
            </AvatarGroup>
            <Text fontSize="md"> are following</Text>
          </HStack>
          <HStack>
            <Button borderRadius="35px" boxShadow="base">
              Twitter
            </Button>
            <Button
              borderRadius="35px"
              boxShadow="base"
              colorScheme="gray"
              variant="solid"
            >
              Sound
            </Button>
            <Button
              borderRadius="35px"
              boxShadow="base"
              colorScheme="gray"
              variant="solid"
            >
              Spotify
            </Button>
          </HStack>
          <Divider orientation="horizontal" />
          <HStack justify={"start"} align={"start"}>
            <Text fontSize="lg">Bio</Text>
            <Spacer />
          </HStack>
        </VStack>
        <ProfileFeed />
      </Flex>
    </Flex>
  );
}

export default Profile;
