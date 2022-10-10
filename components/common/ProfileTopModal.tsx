import { LayoutGroup, motion } from "framer-motion";
import React, { useState } from "react";
import { Avatar, Box, Center, HStack, Text, VStack } from "@chakra-ui/react";

function ToggleContent({ header, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div layout onClick={() => setIsOpen(!isOpen)}>
      <motion.h2 layout>
        <Avatar src={normalizeUrl(profile?.picture?.original?.url)} />
      </motion.h2>
      {isOpen ? (
        <VStack spacing={"25px"}>
          <Box
            m="2rem 0 0 0rem"
            p="10px"
            w="300px"
            boxShadow={"base"}
            borderRadius={"15px"}
          >
            <HStack>
              <Avatar
                size={"md"}
                src={normalizeUrl(profile?.picture?.original?.url)}
              />
              <Text as={"b"} fontSize={"25px"} color={"gray.600"}>
                {profile?.handle}
              </Text>
            </HStack>
            <Center>
              <Box
                w="250px"
                p="15px"
                borderRadius={"15px"}
                boxShadow={"base"}
                m="10px"
              >
                <VStack spacing="2px" m="0 0 5px 0 ">
                  <HStack>
                    <Text as={"b"}>Wallet Balance</Text>
                    <Box bg="gray.400" p="5px" borderRadius="10px">
                      <Text>Network</Text>
                    </Box>
                  </HStack>
                  <Text>1.012 ETH</Text>
                </VStack>
                <Divider />
                <VStack m="5px 0 0 0">
                  <Flex>
                    <Text as={"b"}>Allowance</Text>
                  </Flex>
                  <Text>0.312 ETH</Text>
                </VStack>
              </Box>
            </Center>
            <Center>
              <Box m="10px" w="250px" h="55px">
                <Center>
                  <Button
                    variant={"ghost"}
                    h="45px"
                    w="160px"
                    m="10px"
                    borderRadius="10px"
                    fontSize={"25px"}
                  >
                    Settings
                  </Button>
                </Center>
              </Box>
            </Center>
            <Center>
              <Box m="10px" w="250px" h="55px">
                <Center>
                  <Button
                    variant={"ghost"}
                    h="45px"
                    w="160px"
                    m="10px"
                    borderRadius="10px"
                    fontSize={"25px"}
                  >
                    Help
                  </Button>
                </Center>
              </Box>
            </Center>
            <Center>
              <Box m="10px" w="250px" h="55px">
                <Center>
                  <Button
                    variant={"ghost"}
                    h="45px"
                    w="160px"
                    m="10px"
                    borderRadius="10px"
                    fontSize={"25px"}
                  >
                    Logout
                  </Button>
                </Center>
              </Box>
            </Center>
          </Box>
        </VStack>
      ) : null}
    </motion.div>
  );
}

export default function Index() {
  return (
    <>
      <Center>
        <ToggleContent header={"Notifications"} content={"Post"} />
      </Center>
    </>
  );
}
