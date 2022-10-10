import React from "react";
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
import images from "./images.js";
import styles from "../../styles/carouselSelect.module.css";
import { useQuery, gql } from "@apollo/client";
import EXPLORE_PUBLICATIONS from "graphql/explore/explore-publications";
import Link from "next/link.js";
import LensAvatar from "../LensAvatar";
import { normalizeUrl } from "../../lib/media";
import CollectedBy from "components/Posts/CollectModule/CollectedBy";
import { CollectModuleType, UploadedPost } from "../../types/local";
import { getCollectedPublications } from "graphql/queries";
import { useCollectionQuery } from "@spinamp/spinamp-hooks";

import { useAccount } from "wagmi";

function CarouselSelect(props) {
  const { address, isDisconnected } = useAccount();

  const collection = props?.id;
  return (
    <motion.div className={styles.carousel}>
      <motion.div
        drag="x"
  
        className={styles.inner_carousel}
        width="100%"
      >
        {collection.map((item, index) => {
          return (
            <motion.div className={styles.item} whileHover={{ scale: 1.005 }}>
              <VStack
                borderRadius={"10px"}
                m=" 0.1rem 0.5rem"
                maxH={"480px"}
                spacing="10px"
                key={index}
              >
                <VStack spacing="7px">
                  <motion.div onClick={() => props.setSong(item.lossyAudioUrl)}>
                    <AspectRatio
                      minW="250px"
                      minH="250px"
                      maxH="250px"
                      maxW="250px"
                      ratio={1}
                      borderRadius={"15px"}
                    >
                      <Image
                        src={item?.lossyArtworkUrl}
                        position="relative"
                        className={styles.cover_image}
                        borderRadius={"15px"}
                        boxShadow={"xl"}
                        zIndex={"-1"}
                      />
                    </AspectRatio>
                  </motion.div>
                  <VStack spacing={"1px"}>
                    <Text fontSize={"18px"} noOfLines={1}>
                      {item?.title}
                    </Text>
                    <Text fontSize={"15px"} color={"gray.600"}>
                      {item?.artist?.name}
                    </Text>
                  </VStack>
                </VStack>

                <VStack margin="1rem 1rem" top={"20px"}>
                  <VStack margin="1rem 1rem 0 1rem " spacing={"2px"}>
                    <Text fontSize={"18px"} as="b"></Text>
                  </VStack>
                  <CollectedBy />
                </VStack>
              </VStack>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default CarouselSelect;
