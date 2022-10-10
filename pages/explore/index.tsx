import format from "date-fns/format";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { normalizeUrl, resolveImageUrl } from "lib/media";
import { useQuery, gql } from "@apollo/client";

import React from "react";
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
  Image,
  Spinner,
  AspectRatio,
} from "@chakra-ui/react";
import CarouselUpcoming from "../../components/common/CarouselUpcoming";
import CarouselSmall from "../../components/common/CarouselSmall";
import PublicationReaction from "components/Profile/FunctionalComponents/LikeButton";
import EXPLORE_RECOMMENDED_PROFILES from "graphql/explore/explore-publications";
import Index from "../../components/explore/index";
import LensAvatar from "components/LensAvatar";
import Loader from "../../components/common/Loader"
import FollowButton from "components/Profile/FollowButton";
import { MdOpacity } from "react-icons/md";

const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Home() {
  const { data, loading, error } = useQuery(EXPLORE_RECOMMENDED_PROFILES);

  if (loading)
    return (
     <Loader/>
    );
  if (error) return <div>Something went wrong</div>;
  console.log(data);
  return (
    <motion.div exit={{ opacity: 0 }} initial={{ opacity: 1 }}>
     
      <Box paddingTop="4rem">
        <Text fontSize={"40px"} color="gray.700" m="2rem 2rem 0 2rem">
          Upcoming
        </Text>
        <CarouselUpcoming />
        <Index />
        <Text fontSize={"30px"} color="gray.600" m="2rem 2rem 0 2rem">
          Exlore
        </Text>
        <SimpleGrid
          
          minChildWidth="180px"
          spacing={10}
          m="1rem"
          row={1}
        >
          {data.explorePublications.items.map((item, index) => {
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
                      boxShadow="base"
                      p="10px"
                    >
                      <VStack spacing="2px" p="8px">
                        <LensAvatar
                          profile={item?.profile}
                          height={20}
                          width={20}
                        />

                        <Text fontSize="sm" color={"gray"}>
                          {item?.profile.handle}
                        </Text>

                        <Spacer />
                        <FollowButton profile={item?.profile} />
                      </VStack>
                    </Box>
                    <HStack></HStack>
                  </a>
                </Link>
              </motion.div>
            );
          })}
        </SimpleGrid>
      </Box>
    </motion.div>
  );
}
const blankPhotoStyle = {
  width: "52px",
  height: "52px",
  backgroundColor: "black",
};
