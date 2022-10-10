import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  Flex,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Avatar,
  Box,
  AspectRatio,
} from "@chakra-ui/react";
import { ReactionTypes } from "../../types/index";

import styles from "../../styles/carouselSmall.module.css";
import { useQuery, gql } from "@apollo/client";
import EXPLORE_PUBLICATIONS from "graphql/explore/explore-publications";
import Link from "next/link.js";
import LensAvatar from "../LensAvatar";
import { normalizeUrl } from "../../lib/media";
import useReactToPublication from "../../hooks/lens/useReactToPublication";
import LikeButton from "components/Posts/CollectModule/LikeButtonVariant";
import CollectAndMirrorButton from "../Profile/CollectAndMirrorButton";
import CollectedBy from "components/Posts/CollectModule/CollectedBy";
import { CollectModuleType, UploadedPost } from "../../types/local";
import { useCollectionQuery } from "@spinamp/spinamp-hooks";
import playerContext from "context/AudioContext/playerContext";
import PlayCollectionButton from "components/Profile/FunctionalComponents/PlayCollectionButton";

function CarouselSmall() {
  const { data, loading, error } = useQuery(EXPLORE_PUBLICATIONS);
  const {SetCurrent} = useContext(playerContext)
  const { collection, isLoading, isError, refetch } = useCollectionQuery(
    "0xde0cbd5df89bb67ab804db21e9b931bad4200392"
  );
  if (loading)
    return (
      <VStack>
        <HStack>loading</HStack>
      </VStack>
    );
  
  if (error) return <div>Something went wrong in Carousel</div>;
  console.log(data);
if (isLoading) return <div>loading</div>

  return (
    <motion.div className={styles.carousel}>
       {collection && <PlayCollectionButton collection={collection}/>}
      <motion.div
        drag="x"
        dragConstraints="lef"
        className={styles.inner_carousel}
        width="100%"
      >
        {collection?.map((item, index) => {
         
          return (
            <motion.Box className={styles.item} whileHover={{ scale: 1.005 }} key={index} onTap={() => SetCurrent(index)}>
             
                  <VStack
                    borderRadius={"10px"}
                    m="0.5rem"
                    maxH={"480px"}
                    spacing="10px"
                  >
                    <VStack>
                      <AspectRatio
                        minW="250px"
                        minH="250px"
                        maxH="250px"
                        maxW="250px"
                        ratio={1}
                        borderRadius={"15px"}
                        spacing="10px"
                      >
                        <Image
                        alt="cover"
                          src={item?.lossyArtworkUrl}
                          position="relative"
                          className={styles.cover_image}
                          borderRadius={"20px"}
                          boxShadow={"xl"}
                        />
                      </AspectRatio>
                    </VStack>

                    <VStack margin="1rem 1rem">
                      
                      
                      <VStack margin="1rem 1rem 0 1rem " spacing={"2px"}>
                        <Text fontSize={"18px"}>{item?.title}</Text>
                       
                            <HStack
                              m="5px 0px"
                              spacing={"10px"}
                              alignItems="center"
                            >
                              <Text fontSize={"15px"} color={"gray.600"}>
                                by {item?.artist?.name}
                              </Text>
                            </HStack>
                      
                      </VStack>

                    </VStack>
                  </VStack>
              
            </motion.Box>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default CarouselSmall;
