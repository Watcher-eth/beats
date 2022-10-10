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
  position,
} from "@chakra-ui/react";

function TimedAuction() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600000); // 10 minutes timer

  return (
    <VStack spacing={"4px"}>
      <Text fontSize="xl" color="grey.600">
        Collect until
      </Text>
      <MyTimer expiryTimestamp={time} />
    </VStack>
  );
}

export default TimedAuction;

import { useTimer } from "react-timer-hook";

function MyTimer({ expiryTimestamp }) {
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <Flex style={{ fontSize: "38px" }} position="relative">
      <Text>{hours}</Text>:<Text>{minutes}</Text>:<Text>{seconds}</Text>
    </Flex>
  );
}
