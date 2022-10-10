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

const options = {
  matic: "",
  eth: "",
  dai: "",
};

function PaidButton() {
  return (
    <Button w="300px" h="50px" borderRadius="25px">
      Collect for 3
    </Button>
  );
}

export default PaidButton;
