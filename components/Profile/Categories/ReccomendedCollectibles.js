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

import { useQuery } from "@apollo/client";
import { COLLECTED_NFTS_QUERY } from "../../../graphql/Apolloqueries";
import { useRouter } from "next/router";
import { CHAIN } from "../../../lib/consts";

export default function RecommendedCollectiblesFeed(props) {
  const router = useRouter();

  const { id } = router.query;
  const { data, loading, error, fetchMore } = useQuery(COLLECTED_NFTS_QUERY, {
    variables: {
      request: {
        ownerAddress: props.address,
        limit: 4,
        chainIds: [CHAIN],
      },
    },
  });

  if (loading) return <div>Currently loading</div>;

  if (error) return <div>Something went wrong ${error}</div>;

  console.log(data);

  return (
    <SimpleGrid rows={1} columns={4} spacing={5} padding="1rem ">
      {data.nfts.items.map((item, index) => {
        return (
          <Box
            bg="blackAlpha"
            w={"auto"}
            h={"fit-content"}
            borderRadius={"15px"}
            boxShadow="base"
            paddingBottom="10px"
          >
            <Image
              src={item.originalContent.uri}
              borderTopRadius="10px"
              objectFit="cover"
            />

            <VStack spacing="2px">
              <HStack spacing="55" margin={"0.75rem"} w="92%">
                <HStack overflow={"hidden"}>
                  <Image
                    src={item.originalContent.uri}
                    boxSize={"20px"}
                    borderRadius="5px"
                  />
                  <Text fontSize="sm" color="gray.600">
                    {item.name}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}
