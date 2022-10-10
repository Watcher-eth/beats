import React, { useState } from "react";
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
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import { ReactionTypes } from "../../types/index";
import logger from "lib/logger";
import styles from "../../styles/carousel.module.css";
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

function Carousel() {
  const { data, loading, error, fetchMore } = useQuery(EXPLORE_PUBLICATIONS);

  if (loading)
    return (
      <VStack>
        <HStack>loading</HStack>
      </VStack>
    );

  if (error) return <div>Something went wrong in Carousel</div>;


  return (
    <motion.div exit={{ opacity: 0 }} className={styles.carousel}>
      <motion.div
        drag="x"
        dragConstraints="left"
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
            <motion.div className={styles.item} whileHover={{ scale: 1.0 }}>
              <HStack
                maxH={"470px"}
                minH={"470px"}
                boxShadow={"2xl"}
                borderRadius={"10px"}
                m="1rem"
              >
                <VStack>
                  <Link href={`/post/${item.id}`} key={index}>
                    <a>
                      <Center       minWidth="470px"
                          minHeight="470px" p="0 10px">
                        <Image
                          src={normalizeUrl(
                            item?.metadata?.media[0]?.original?.url
                          )}
                          className={styles.cover_image}
                          width="450px"
                          height="450px"
                          layout="intrinsic"
                          style={{
                            borderRadius: "10px",
                          }}
                        />
                      </Center>
                    </a>
                  </Link>
                </VStack>

                <VStack margin="1rem 1rem">
                  <Flex margin="1rem 1rem" direction={"column"}>
                    <Text fontSize={"35px"}>{item?.metadata?.name}</Text>
                    <Link href={`/profile/${item?.profile.id}`} key={index}>
                      <a>
                        <HStack
                          m="5px 0px"
                          spacing={"10px"}
                          alignItems="center"
                        >
                          <Text fontSize={"25px"} color={"gray.600"}>
                            by {item?.profile?.handle}
                          </Text>
                        </HStack>
                      </a>
                    </Link>
                    <Text fontSize={"25px"} color={"gray.600"} noOfLines="5">
                      {item?.metadata?.content}
                    </Text>
                  </Flex>
                  <VStack>
                    {item.collectModule.isLimitedFeeCollect ||
                    item.collectModule.isLimitedTimeFeeCollect ? (
                      <Flex direction={"column"}>
                        <Text fontSize={"30px"}>
                          Editions {item?.collectModule?.collectLimit}
                        </Text>
                        <Text fontSize={"20px"} color={"gray.600"}>
                          {item?.collectModule?.ammount}{" "}
                          {item?.collectModule?.amount?.currency}
                        </Text>
                      </Flex>
                    ) : (
                      <div></div>
                    )}
                  </VStack>
                  <HStack spacing={"3px"}>
                    <button
                      onClick={
                        reactionData.userReaction == ReactionTypes.Upvote
                          ? () => removeReaction(item?.id, ReactionTypes.Upvote)
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
                  <CollectedBy id={item?.id} />
                </VStack>
              </HStack>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default Carousel;
