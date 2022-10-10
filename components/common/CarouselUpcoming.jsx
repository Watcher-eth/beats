import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Box,
  AspectRatio,
  AvatarGroup,
  Center,
  Divider,
} from "@chakra-ui/react";
import { ReactionTypes } from "../../types/index";
import Image from "next/image";
import styles from "../../styles/carouselUpcoming.module.css";
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
import PlayCollectionButton from "components/Profile/FunctionalComponents/PlayCollectionButton";
import playerContext from "context/AudioContext/playerContext";
function CarouselUpcoming() {
  const { collection, isLoading, isError, refetch } = useCollectionQuery(
    "0xde0cbd5df89bb67ab804db21e9b931bad4200392"
  );
  const {SetCurrent} = useContext(playerContext)
  const { data, loading, error } = useQuery(EXPLORE_PUBLICATIONS);

  if (loading)
    return (
      <VStack>
        <HStack>loading</HStack>
      </VStack>
    );

  if (error) return <div>Something went wrong in Carousel</div>;
  console.log(data);
  const easing = [0.6, -0.05, 0.01, 0.99];

  const fadeInUp = {
    initial: { y: 70, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.5, duration: 1, ease: easing },
    },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };
  return (
    <motion.div className={styles.carousel}>
       {collection && <PlayCollectionButton collection={collection}/>}
      <motion.div
        drag="x"
        dragConstraints="lef"
        className={styles.inner_carousel}
        width="100%"
        variants={stagger}
      >
        {collection?.map((item, index) => {
          return (
            <motion.div
            key={index}
              className={styles.item}
              whileHover={{ scale: 1.005 }}
              variants={fadeInUp}
            >
              <HStack borderRadius={"10px"} m={["1rem", "1.5rem", "2rem", "0rem"]}>
                <VStack>
                  <Link href={`/track/${item?.slug}`} key={index}>
                    <a>
                      <motion.div
                        initial={{ x: 90, opacity: 0 }}
                        animate={{ x: 0, opacity: 1, duration: 2 }}
                        onClick={() => SetCurrent(index)}
                      >
                        <Box height={"450px"} width={"450"}>
                          <Image
                          alt="track cover"
                            height={"450px"}
                            width={"450"}
                            layout={"fixed"}
                            src={item?.lossyArtworkUrl}
                            style={{
                              borderRadius: "15px",
                              position: "relative",
                              zIndex: -1,
                            }}
                          />
                        </Box>
                      </motion.div>
                    </a>
                  </Link>

                  <Center>
                    <VStack
                      direction={"column"}
                      className={styles.overlay_container}
                    >
                      <VStack>
                        <Link
                          href={`/profile/${item?.profile?.id}`}
                          key={index}
                        >
                          <a>
                            <motion.div whileHover={{ scale: 1.03 }}>
                              <Flex
                                p="3px 3px 3px 5px"
                                alignItems="center"
                                borderRadius={"25px"}
                                boxShadow="2xl"
                                bg={"white"}
                                w="-moz-fit-content"
                              >
                                <Avatar
                                  size="sm"
                                  src={item?.artist?.profiles?.sound?.avatarUrl}
                                />
                                <Text
                                  m={"3px 7px 3px 3px"}
                                  fontSize={"18px"}
                                  alignSelf="center"
                                  color={"gray.700"}
                                >
                                  {item?.artist?.name}
                                </Text>
                              </Flex>
                            </motion.div>
                          </a>
                        </Link>
                      </VStack>
                    </VStack>
                  </Center>
                  <Flex className={styles.overlay2_container}>
                    <CollectedBy id={item?.id} />
                  </Flex>
                </VStack>
              </HStack>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default CarouselUpcoming;
