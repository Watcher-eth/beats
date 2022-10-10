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
import React from "react";

function Comments() {
  return (
    <Flex direction={"column"}>
      <Flex margin="1rem 0 0 0" padding="8spx" w="70%">
        <Avatar
          name="Segun Adebayo"
          src="https://bit.ly/sage-adebayo"
          size="md"
          m="10px"
        />
        <Flex direction={"column"} marginLeft="0.5rem">
          <Text fontSize="md">ProvenAuthoritiy.lens</Text>
          <Text fontSize="md" color="gray.600">
            Replying to Thomas
          </Text>
          <Text fontSize="md">
            This is the actual comment to the mirrored post which is why i have
            to get this right. descirpion goes here whe everything is finally
            said and done This is a shorthand for the flex-direction and
            flex-wrap properties, which together define the flex container’s
            main and cross axes. The default value is row nowrap.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Comments;
