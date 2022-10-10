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
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { normalizeUrl } from "lib/media";
import { useQuery } from "@apollo/client";
import { COLLECTED_NFTS_QUERY } from "../../../graphql/Apolloqueries";
import { useRouter } from "next/router";
import LikeButton from "components/Posts/CollectModule/LikeButtonVariant";

const POLYGON_CHAIN_ID = 1;

function CollectiblesFeed(props) {
  const { data, loading, error } = useQuery(COLLECTED_NFTS_QUERY, {
    variables: {
      request: {
        ownerAddress: props.address,
        limit: 30,
        chainIds: [POLYGON_CHAIN_ID],
      },
    },
  });

  if (loading) return <div>Currently loading</div>;

  if (error) return <div>Something went wrong on Collectibles feed</div>;
  console.log(props.src);
  console.log(data);
  return (
    <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing={10}>
      {data.nfts.items.map((item, index) => {
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: index * 0.5 }}
          >
            <Box
              bg="blackAlpha"
              boxShadow="base"
              height=""
              key={index}
              borderBottomRadius={"10px"}
              w={["200px", "270px", "450px"]}
            >
              {item.originalContent.uri ? (
                <a>
                  <Image
                    src={normalizeUrl(item?.originalContent?.uri)}
                    width={"400px"}
                    height={"400px"}
                    layout="responsive"
                    style={{
                      position: "relative",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                </a>
              ) : (
                <Box
                  height={"450px"}
                  bg={"gray.800"}
                  borderTopRadius={"10px"}
                ></Box>
              )}

              <VStack spacing={"1px"} alignSelf={"flex-start"} m="0.5rem">
                <HStack w="100%">
                  <Flex direction="column" m="10px">
                    <Text noOfLines={1} fontSize="lg">
                      {item?.name}
                    </Text>
                    <Text color="gray">{item?.contractName}</Text>
                  </Flex>
                  <Spacer />
                </HStack>

                <HStack w="100%" p={"0 10px 15px 10px"}>
                  <Avatar
                    name={props?.name}
                    src={normalizeUrl(props.src)}
                    size="xs"
                  />
                  <Text fontSize="lg">{props?.name}</Text>
                </HStack>
              </VStack>
            </Box>
          </motion.div>
        );
      })}
    </SimpleGrid>
  );
}

export default CollectiblesFeed;
