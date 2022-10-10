import format from "date-fns/format";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { normalizeUrl, resolveImageUrl } from "../lib/media";
import { useQuery, gql } from "@apollo/client";
import styles from "../styles/backgroundBlur.module.css";
import React from "react";
import HomeMedia from "../components/Home/homeMedia";
import { motion } from "framer-motion";
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
  Input,

  Spinner,
  AspectRatio,
} from "@chakra-ui/react";
import Carousel from "../components/common/Carousel";
import CarouselSmall from "../components/common/CarouselSmall";
import PublicationReaction from "../components/Profile/FunctionalComponents/LikeButton";
import EXPLORE_PUBLICATIONS from "../graphql/explore/explore-publications";
import Image from "next/image";
import LensAvatar from "../components/LensAvatar";

import FollowButton from "../components/Profile/FollowButton";
import CollectedBy from "../components/Posts/CollectModule/CollectedBy";

const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Home() {
  const { data, loading, error } = useQuery(EXPLORE_PUBLICATIONS);

  if (loading)
    return (
      <VStack>
        <HStack>loading</HStack>
      </VStack>
    );

  if (error) return <div>Something went wrong</div>;

  return (
    <motion.div exit={{ opacity: 0 }} initial="initial" animate="animate">
      <Flex direction={["column", "column", "row", "row"]}>
        <div className={styles.container}>
          <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
          <div></div>
        </div>
      </Flex>
      <Center bg={"blackAlpha.100"} blur={"xl"} width={[, "100%", "100%" ,"100%","100%"]} p={[ "8rem 0  0 0","6rem 2rem 0 2rem", "9rem 2rem 0 2rem","8rem 0 5.5rem 0"]}>
        <Flex direction={[ "column", "column","row", "row"]}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ x: 90, opacity: 0 }}
            animate={{ x: 0, opacity: 1, duration: 4,}}
          >
            <Image
              src={normalizeUrl(
                data?.explorePublications?.items[11]?.metadata?.media[0]
                  ?.original?.url
              )}
    width={"500px"}
    height={"500px"}
    layout="intrinsic"
              style={{borderRadius:"10px",  margin:""}}
            
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ x: 90, opacity: 0 }}
            animate={{ x: 0, opacity: 1, duration: 4 }}
          >
          <Flex direction={"column"} p={[ "1.5rem 2.5rem","2rem","3rem","5rem", ]} color={"white"}>
            <Text fontSize={["50px", "60px","60px", "70px"]}>{data?.explorePublications?.items[11].metadata?.name}</Text>
            <HStack spacing={"15px"} m={[ "0.25rem","0.25rem","0.5rem","0.75rem"]}>
              <VStack spacing={"10px"}m={[ "0.25rem","0.3rem","0.4rem","0.5rem"]}>
             
                <HStack p="7px" borderRadius={"25px"} bg="white" color={"black"} >
                <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 1.1 }}
                            >
                              <LensAvatar
                                profile={data?.explorePublications?.items[11].profile}
                                height={35}
                                width={35}
                              />
                            </motion.div>
                  <Text>{data?.explorePublications?.items[11].profile?.handle}</Text>
                </HStack>
              </VStack>
              <VStack spacing={"1px"} m={[ "0.25rem","0.3rem","0.4rem","0.5rem"]}>
              
                <CollectedBy id={data?.explorePublications?.items[11].id} />
              </VStack>
            </HStack>
            <Center m="0rem 0rem">
              <HStack spacing={"25px"}>
                <VStack spacing={"5px"}>
                  <Text fontSize={"30px"}>Editions</Text>
                  <Text fontSize={"25px"}>10/100</Text>
                </VStack>
                <VStack spacing={"5px"}>
                  <Text fontSize={"30px"}>Time</Text>
                  <Text fontSize={"25px"}>11:25:37</Text>
                </VStack>
            
              </HStack>

            </Center>
          </Flex>
          </motion.div>
        </Flex>
      </Center>

      <Box >
        <Text fontSize={"40px"} color="gray.700" m={["10rem 0 0", "20rem 0 0 0", "5rem 1rem 0 2rem", "3rem 2rem 0 3rem"]}>
          Upcoming
        </Text>
        <Carousel />
        <Text fontSize={"35px"} color="gray.600" m="1rem 1rem 0 2rem">
          Top 10
        </Text>
        <CarouselSmall />

        <Text fontSize={"30px"} color="gray.600" m="2rem 2rem 0 2rem">
          Exlore
        </Text>
        <SimpleGrid
          
          minChildWidth="380px"
          spacing={10}
          m="1rem"
          row={1}
        >
          {data?.explorePublications?.items.map((item, index) => {
            const date = new Date(item.createdAt);

            return (
              <motion.div whileHover={{ scale: 1.01 }}>
                <Link href={`/profile/${item?.profile?.handle}`} key={index}>
                  <a>
                    <Box
                      bg="blackAlpha"
                      height=""
                      w=""
                      borderRadius={"15px"}
                      boxShadow="xl
                    "
                      paddingBottom="10px"
                    >
                      <VStack spacing="2px">
                        <Flex margin={"0.3rem"} w="92%">
                          <HStack margin="">
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 1.1 }}
                            >
                              <LensAvatar
                                profile={item?.profile}
                                height={55}
                                width={55}
                              />
                            </motion.div>
                            <Flex direction={"column"}>
                              <Text fontSize="lg">{item?.profile?.name}</Text>
                              <Text fontSize="sm" color={"gray"}>
                                {item?.profile?.handle}
                              </Text>
                            </Flex>
                          </HStack>
                          <Spacer />
                          <FollowButton profile={item?.profile} />
                        </Flex>
                      </VStack>
                    </Box>
              
                  </a>
                </Link>
              </motion.div>
            );
          })}
        </SimpleGrid>
        <HStack><HomeMedia/></HStack>
      </Box>
    </motion.div>
  );
}
const blankPhotoStyle = {
  width: "52px",
  height: "52px",
  backgroundColor: "black",
};
