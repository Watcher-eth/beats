import { useRouter } from "next/router";
import { motion } from "framer-motion";
import FollowerList from "components/Profile/followerAvatar";
import { useProfile } from "../../context/context";
import { useQuery, gql } from "@apollo/client";
import { normalizeUrl } from "../../lib/media";
import { GetStaticPaths, GetStaticProps } from "next";
import { nodeClient } from "../../lib/apolloClient";
import {
  Post,
  Profile,
  Query,
  SingleProfileQueryRequest,
} from "../../types/index";
import React, { FC } from "react";
import {
  AspectRatio,
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
  Image,
} from "@chakra-ui/react";
import Loader from "components/common/Loader";
import CreatedFeed from "../../components/Profile/Categories/CreatedFeed";
import GET_PROFILE from "../../graphql/profiles/get-profile";
import CollectiblesFeed from "../../components/Profile/Categories/CollectiblesFeed";
import FullPageLoader from "components/common/FullPageLoader";
import LensAvatar from "components/LensAvatar";
import FollowButton from "../../components/Profile/FollowButton";
import useAppStore from "../../lib/store";
import FollowedBy from "components/Profile/followedBy";
import Waveform from "components/Music Player/Waveform";
import MusicNftFeed from "components/Profile/Categories/MusicNftFeed";
const ProfilePage: FC<{ profile: Profile }> = ({ profile }) => {
  const router = useRouter();
  const { handle } = router.query;

  return (
    <motion.div initial="initial" exit={{ opacity: 0 }}>
      <Flex w="100%" h="100%" direction={"column"}>
        <AspectRatio minW="300px" ratio={4.5} zIndex={-1}>
          {profile?.coverPicture?.original?.url ? (
            <Image
              objectFit={"cover"}
              src={normalizeUrl(profile?.coverPicture?.original?.url)}
              alt="background cover"
            />
          ) : (
            <Box bg={"black"} w="100%"></Box>
          )}
        </AspectRatio>

        <Flex
          direction={["column"]}
 
          margin={"1rem 0 "}
          justify="start"
        >
          <Flex m={["", " 1rem 0rem","0rem", "0 0 0rem 0" ]}direction={["column", "column", "column", "row"]}>
      
              <Box      top={["-3rem", "-1", "-3rem", "-8rem"]}  position="relative"
              left={[ "7rem",  "9rem",  "5rem",  "9rem", ]} border="2px white" borderRadius={"50%"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    
            zIndex: -1,

                    
                  }}
                >
                  <LensAvatar profile={profile} height={40} width={40} />
                </motion.div>
              </Box>

              <Flex direction={"column"} p={["0 1.4rem", "0  0 0 6rem", " 0", "0"]}>
                <Flex direction={"column"} m={[ "0.5rem 1rem ", "0 1rem 0.5 0 ","1rem 0", "3rem 0 10px 0"]}>
                  <Text fontSize={"35px"}>{profile?.name}</Text>
                  <Text fontSize={"18px"} color="darkGray">
                    {profile?.handle}
                  </Text>
                </Flex>
                <HStack spacing={"10px"} m="0px 0 15px 0">
                  {(() => {
                    const website = profile?.attributes?.find(
                      (attr) => attr.key == "website"
                    );
                    if (!website) return;

                    return (
                      <a
                        href={`${website.value}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            bg={"gray.800"}
                            color="white"
                            className="sr-only"
                            borderRadius="25px"
                            h="35px"
                          >
                            Website
                          </Button>
                        </motion.div>
                      </a>
                    );
                  })()}
                  {(() => {
                    const twitter = profile?.attributes?.find(
                      (attr) => attr.key == "twitter"
                    );
                    if (!twitter) return;

                    return (
                      <a
                        href={`https://twitter.com/${twitter.value}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            colorScheme={"twitter"}
                            borderRadius="25px"
                            className="sr-only"
                            h="35px"
                          >
                            Twitter
                          </Button>
                        </motion.div>
                      </a>
                    );
                  })()}
                </HStack>
                <Divider orientation="horizontal" />

                <Text
                  color={"gray.600"}
                  alignSelf={"start"}
                  maxWidth="500px"
                  m={["0","0 0","0 0 0px 0", "0 0 10px 0"]}
                >
                  {profile?.bio}
                </Text>
              </Flex>
           

            <Spacer />
            <Flex direction={["column", "column", ]}  p={[ "0 2rem","0 4rem", "0 3.5rem 0 0", "0rem 3.5rem 0  0"]}>
            <Center>
              <HStack spacing="10px"  m={[ "1rem 0 0 0 ","1rem 0 0 0rem"]}>
       
                <VStack spacing={"1px"} m="0.3rem">
                  <Text fontSize="30px">{profile?.stats?.totalFollowers}</Text>
                  <Text fontSize="md">Followers</Text>
                </VStack>
                <Divider orientation="vertical" h="80%" m="0.3rem" />
                <VStack spacing={"1px"} m="0.3rem 0 0 0">
                  <Text fontSize="30px">{profile?.stats?.totalFollowing}</Text>
                  <Text fontSize="md">Following</Text>
                </VStack>
              </HStack>
              </Center>
      <VStack m={[ "1rem 0 0 0 ","1rem 0 0 0rem"]}>
              {profile?.id && (
                <FollowedBy id={profile?.id} name={profile?.handle} />
              )}
                      <Center  m="0.3rem">
              {profile && <FollowButton profile={profile} />}
              
              </Center>
              </VStack>
            </Flex>
          </Flex>
        </Flex>
        <VStack margin={"2rem"} alignSelf={"center"}>
          <HStack spacing="2rem " w="100%">
            <Tabs isFitted colorScheme={"blackAlpha"}>
              <TabList>
                <Tab>Posts</Tab>
                <Tab>{profile?.name && <Text p="0 4px 0 0">{profile?.name}'s </Text>} Collection</Tab>

              </TabList>
              <TabPanels p="2.5rem">
                <TabPanel>
                  {" "}
                  <CreatedFeed
                    name={profile?.handle}
                    src={profile?.picture?.original?.url}
                    id={profile?.id}
                  />
                </TabPanel>
                <TabPanel>
                  {" "}
                  <MusicNftFeed address={profile?.ownedBy} />
                </TabPanel>
                
              </TabPanels>
            </Tabs>
          </HStack>
        </VStack>
      </Flex>
    </motion.div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params: { handle },
}) => {
  const {
    data: { profile },
  } = await nodeClient.query<
    { profile: Query["profile"] },
    SingleProfileQueryRequest
  >({
    query: GET_PROFILE,
    variables: { handle },
  });

  if (!profile) return { notFound: true };

  return {
    props: { profile },
  };
};
export default ProfilePage;
