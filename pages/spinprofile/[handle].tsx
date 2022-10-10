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
import React, { FC, useEffect } from "react";
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
import Created from "./created"
import Owners from "./owners copy";
import { useArtistQuery } from "@spinamp/spinamp-hooks";

export default function ProfilePage  () {
  const router = useRouter();
  const { handle } = router.query;
  const { artist, isLoading, isError, refetch } = useArtistQuery(
    handle
  );

 const name = artist?.name

 if(isLoading) return (<div>loading</div>)


  console.log(artist)
  
  return (
    <motion.div>
       <Flex w="100%" h="100%" direction={"column"}>
        <AspectRatio minW="300px" ratio={4.5} zIndex={-1}>
          {artist?.profiles?.sound ? (
            <Image
              objectFit={"cover"}
              src={artist?.profiles?.sound?.avatarUrl}
              alt="background cover picture"
            />
          ) : (
            <Image
            objectFit={"cover"}
            alt="background cover picture"
            src={artist?.profiles?.catalog?.avatarUrl}
          />
          )}
        </AspectRatio>
        <HStack
      spacing={"10px"}
 
         p={"1rem 3rem "}
         
        >
          <HStack     p={"1rem 3rem "} spacing={"10px"}>
      
              <Box       
              border="2px white" borderRadius={"50%"}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    
     

                    
                  }}
                >
                 {artist?.profiles?.sound && <Avatar src={artist?.profiles?.sound?.avatarUrl} height={40} width={40} />}
                </motion.div>
              </Box>

            
                <VStack>
              <Text fontSize={"35px"}>{artist?.name}</Text>
        
                <HStack spacing={"10px"} p="10px 0 15px 0">
      
                    {artist?.profiles?.sound &&
                      <a
                        href={artist?.profiles?.sound?.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            bg={"blue"}
                            color="white"
                            className="sr-only"
                            borderRadius="25px"
                            h="35px"
                          >
                            Sound
                          </Button>
                        </motion.div>
                      </a>
}

{artist?.profiles?.catalog &&
                      <a
                        href={artist?.profiles?.catalog?.websiteUrl}
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
                            Catalog
                          </Button>
                        </motion.div>
                      </a>
}
{artist?.profiles?.mintsongs &&
                      <a
                        href={artist?.profiles?.mintsongs?.websiteUrl}
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
                            MintSongs
                          </Button>
                        </motion.div>
                      </a>
}

                 </HStack>
                 <HStack spacing={"3px"}>
                  
                 <Owners id={artist?.id}/>
                 {artist?.profiles && <Text> collectors across {artist?.profiles?.length} platforms</Text> }</HStack>
                 </VStack>
          </HStack>

        </HStack>
        <VStack margin={"2rem"} alignSelf={"center"}>
          <HStack spacing="2rem " w="100%">
            <Tabs isFitted colorScheme={"blackAlpha"}>
              <TabList>
                <Tab>Created</Tab>
             

              </TabList>
              <TabPanels p="2.5rem">
               
                <TabPanel>
                  {" "}
                 
                </TabPanel>
                <Created id={artist?.id}/>
              </TabPanels>
            </Tabs>
          </HStack>
        </VStack>
      </Flex>
    </motion.div>
  )
}

