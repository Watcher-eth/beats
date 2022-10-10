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
import vinyl from "./Assets/vinyl.svg";
import CollectiblesFeed from "./Categories/CollectiblesFeed";
import CreatedFeed from "./Categories/CreatedFeed";

function ProfileFeed(props) {
  return (
    <VStack margin={"2rem"}>
      <HStack spacing="2rem " w="100%">
        <Tabs isFitted colorScheme={"blackAlpha"}>
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Collectibles</Tab>
            <Tab>Verefiable Credentials</Tab>
          </TabList>
          <TabPanels p="2rem">
            <TabPanel>
              <CreatedFeed name={props.name} src={props.src} />
            </TabPanel>
            <TabPanel>
              <CollectiblesFeed
                address={props.address}
                name={props.name}
                src={props.src}
              />
            </TabPanel>
            <TabPanel>Red, yellow and blue.</TabPanel>
          </TabPanels>
        </Tabs>
      </HStack>
    </VStack>
  );
}

export default ProfileFeed;
