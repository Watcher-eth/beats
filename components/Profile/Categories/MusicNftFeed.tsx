import React, { useContext, useEffect, useState } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import Image from "next/image";
import { normalizeUrl } from "lib/media";
import { useQuery } from "@apollo/client";
import { COLLECTED_NFTS_QUERY } from "../../../graphql/Apolloqueries";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import PlayCollectionButton from "../FunctionalComponents/PlayCollectionButton";
import { useCollectionQuery } from "@spinamp/spinamp-hooks";
import { FaPlay } from "react-icons/fa";
import playerContext from "context/AudioContext/playerContext";
import Link from "next/link";
const POLYGON_CHAIN_ID = 1;

function MusicNftFeed(props) {
   

  const { collection, isLoading, isError, refetch } = useCollectionQuery(
    props.address
  );
const {SetCurrent} = useContext(playerContext)


 if(isLoading) return(<div>loading</div>)

 if (isError) return(<div>error</div>)
 
 


  return (
    <div>{collection && <PlayCollectionButton collection={collection}/>}
    <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing={10}>
      {collection?.map((item, index) => {
        return (
          <motion.div
          key={index}
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
             <Link href={`/track/${item?.slug}`} key={index}>
                    <a>
                <Image
                  src={item?.lossyArtworkUrl}
                  alt="track cover"
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
              </Link>

              <VStack spacing={"1px"} alignSelf={"flex-start"} m="0.5rem">
                <HStack w="98%" m="0  30px 0 20px">
                  <Flex direction="column" m="10px">
                    <Text noOfLines={1} fontSize="lg">
                      {item?.title}
                    </Text>
                    <Text color="gray">{item?.platformId}</Text>
                  </Flex>
                  <Spacer />
                  <IconButton aria-label="play" h="40px" w="40px" m="15px" p="10px 10px 10px 12px" variant="flushed" bg="blackAlpha.200" borderRadius={"50%"} icon={<FaPlay />} onClick={() => SetCurrent(index)} />
            
        
                </HStack>
                <Link href={`/spinprofile/${item?.artist?.slug}`} key={index}><a>
                <HStack w="100%" p={"0 10px 15px 10px"}>
                
                  <Avatar
                    name={props?.name}
                    src={normalizeUrl(item?.artist?.profiles?.sound?.avatarUrl)}
                    size="xs"
                  />
                  <Text fontSize="lg">{item?.artist?.name}</Text>

                </HStack>
                </a></Link>
              </VStack>
            </Box>
          </motion.div>
        );
      })}
    </SimpleGrid>
    </div>
  );
}

export default MusicNftFeed;
