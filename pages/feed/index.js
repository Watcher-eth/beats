import { useState, useEffect } from "react";
import { normalizeUrl } from "../../lib/media";
import Link from "next/link";
import FollowButton from "../../components/Profile/FollowButton";
import { useQuery, gql } from "@apollo/client";
import backgroundBlur from "../../components/common/backgroundBlur";
import ABI from "../../lib/abi.json";
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
  Input,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { RECOMMENDED_PROFILES_QUERY } from "../../graphql/Apolloqueries";
import RecommendedCollectiblesFeed from "../../components/Profile/Categories/ReccomendedCollectibles";
import FullPageLoader from "../../components/common/FullPageLoader";
import Loader from "../../components/common/Loader"
export default function Home() {
  const { data, loading, error } = useQuery(RECOMMENDED_PROFILES_QUERY);

  if (loading)
    return (
  <Loader/>
    );

  if (error) return <div>Something went wrong</div>;
  console.log(data);

  return (
    <div>
      <backgroundBlur />
      <SimpleGrid minChildWidth="350px" spacing={10} marginTop="5rem">
        {data.recommendedProfiles.map((profile, index) => {
          return (
            <Link href={`/profile/${profile.handle}`} key={index}>
              <a>
                <Box
                  bg="blackAlpha"
                  height=""
                  w=""
                  borderRadius={"15px"}
                  boxShadow="base"
                  paddingBottom="10px"
                >
                  <VStack spacing="2px">
                    <Flex margin={"0.75rem"} w="92%">
                      <HStack margin="">
                        <Image
                          src={normalizeUrl(profile.picture?.original?.url)}
                          width="52px"
                          height="52px"
                          borderRadius="10px"
                        />
                        <Flex direction={"column"}>
                          <Text fontSize="lg">{profile.name}</Text>
                          <Text fontSize="sm" color={"gray"}>
                            {profile.handle}
                          </Text>
                        </Flex>
                      </HStack>
                      <Spacer />
                      <FollowButton profile={profile} />
                    </Flex>
                  </VStack>
                </Box>
                <HStack></HStack>
              </a>
            </Link>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
const blankPhotoStyle = {
  width: "52px",
  height: "52px",
  backgroundColor: "black",
};
