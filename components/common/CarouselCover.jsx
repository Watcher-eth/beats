import React from "react";
import { motion } from "framer-motion";
import {
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Box,
} from "@chakra-ui/react";
import { ReactionTypes } from "../../types/index";
import images from "./images.js";
import styles from "../../styles/carouselCover.module.css";
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
import Image from "next/image";
function CarouselCover() {
  const { data, loading, error } = useQuery(EXPLORE_PUBLICATIONS);

  if (loading)
    return (
      <VStack>
        <HStack>loading</HStack>
      </VStack>
    );

  if (error) return <div>Something went wrong in Carousel</div>;

  

  return (
    <motion.div className={styles.carousel}>
      <motion.div
        drag="x"
        dragConstraints="lef"
        className={styles.inner_carousel}
        width="100%"
      >
        {data.explorePublications.items.map((item, index) => {
          const {
            removeReaction,
            data: reactionData,
            upvotePublication,
            downvotePublication,
            loading: reactionLoading,
          } = useReactToPublication(item?.id);
          return (
            <motion.Box className={styles.item} whileHover={{ scale: 1.005 }}>
              <Link href={`/post/${item.id}`} key={index}>
                <a>
                  <VStack
                    borderRadius={"10px"}
                    m="0.5rem"
                    maxH={"480px"}
                    spacing="10px"
                  >
                    <VStack spacing="10px">
                      <Image
                        src={normalizeUrl(item.metadata.media[0].original.url)}
                        styles={{
                          position: "relative",
                          boxShadow: "xl",
                          borderRadius: "15px",
                        }}
                        className={styles.cover_image}
                        borderRadius={"20px"}
                        width="500px"
                        height={"500px"}
                        layout="responsive"
                      />
                    </VStack>

                    <VStack margin="1rem 1rem">
                      <HStack spacing={"3px"}>
                        <button
                          onClick={
                            reactionData.userReaction == ReactionTypes.Upvote
                              ? () =>
                                  removeReaction(item?.id, ReactionTypes.Upvote)
                              : () => upvotePublication(item?.id)
                          }
                          className="hover:bg-gray-100 rounded-full p-2"
                        >
                          <LikeButton
                            loading={reactionLoading}
                            active={
                              reactionData.userReaction == ReactionTypes.Upvote
                            }
                          />
                        </button>
                        <CollectAndMirrorButton
                          id={item?.id}
                          referenceModule={item?.referenceModule?.__typename}
                        />
                      </HStack>
                      <VStack margin="1rem 1rem 0 1rem " spacing={"2px"}>
                        <Text fontSize={"18px"}>{item?.metadata?.name}</Text>
                        <Link href={`/profile/${item.profile.id}`} key={index}>
                          <a>
                            <HStack
                              m="5px 0px"
                              spacing={"10px"}
                              alignItems="center"
                            >
                              <Text fontSize={"15px"} color={"gray.600"}>
                                by {item?.profile?.handle}
                              </Text>
                            </HStack>
                          </a>
                        </Link>
                      </VStack>

                      {item.collectModule.isLimitedFeeCollect ||
                      item.collectModule.isLimitedTimeFeeCollect ? (
                        <VStack>
                          <Flex direction={"column"}>
                            <Text fontSize={"15px"}>
                              Editions {item?.collectModule?.collectLimit}
                            </Text>
                            <Text fontSize={"8px"} color={"gray.600"}>
                              {item?.collectModule?.ammount}{" "}
                              {item.collectModule.amount?.currency}
                            </Text>
                          </Flex>
                        </VStack>
                      ) : null}

                      <CollectedBy id={item?.id} />
                    </VStack>
                  </VStack>
                </a>
              </Link>
            </motion.Box>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default CarouselCover;
