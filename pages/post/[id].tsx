import React, { FC, useMemo, useState } from "react";
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
  Image,
  Input,
  AspectRatio,
} from "@chakra-ui/react";
import TimedAuction from "../../components/Posts/CollectModule/TimedAuction";
import format from "date-fns/format";
import { nodeClient } from "../../lib/apolloClient";
import Linkify from "react-linkify";
import styles from "../../styles/backgroundBlurGray.module.css";
import {
  Comment,
  Maybe,
  Mirror,
  PaginatedPublicationResult,
  Post,
  ReactionTypes,
} from "../../types/index";
import { GetStaticPaths, GetStaticProps } from "next";
import Router, { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import GET_PUBLICATION_COMMENTS from "graphql/publications/get-publication-comments";
import GET_PUBLICATION from "../../graphql/publications/get-publication";
import { normalizeUrl } from "lib/media";
import CollectAndMirrorButton from "components/Profile/CollectAndMirrorButton";
import { motion } from "framer-motion";
import useReactToPublication from "../../hooks/lens/useReactToPublication";
import LensAvatar from "components/LensAvatar";
import LikeButton from "components/Posts/CollectModule/LikeButtonVariant";
import CollectButton from "../../components/Posts/CollectModule/TestButton";
import CollectedBy from "components/Posts/CollectModule/CollectedBy";
import { graphqlSync } from "graphql";
import CommentField from "components/CommentField";
const MusicPost: FC<{ video: Maybe<Post> }> = ({ video }) => {
 const router = useRouter()

  const [isHovered, setHovered] = useState(false);
  const {
    data: commentData,
    loading: commentsLoading,
    refetch: refetchComments,
  } = useQuery<{ comments: PaginatedPublicationResult }>(
    GET_PUBLICATION_COMMENTS,
    {
      variables: { id: video?.id },
      skip: !video,
    }
  );

  const {
    removeReaction,
    data: reactionData,
    upvotePublication,
    downvotePublication,
    loading: reactionLoading,
  } = useReactToPublication(video?.id);
  const comments = useMemo<Comment[] | null>(() => {
    return commentData?.comments?.items?.filter(
      (comment) => !comment.hidden
    ) as Comment[] | null;
  }, [commentData]);
  console.log(video);

  const isFreeCollect =
    video?.collectModule.__typename === "FreeCollectModuleSettings";


    const isFeeCollect =
    video?.collectModule.__typename === "FeeCollectModuleSettings";


    const isTimedFeeCollect =
    video?.collectModule.__typename === "TimedFeeCollectModuleSettings";
    const isLimitedFeeCollect =
    video?.collectModule.__typename === "LimitedFeeCollectModuleSettings";
    const isLimitedTimeFeeCollect =
    video?.collectModule.__typename === "LimitedTimedFeeCollectModuleSettings";
    if (commentsLoading) return (<div>loading</div>)

if (video && comments)
  return (
    <motion.div initial="initial" exit={{ opacity: 0 }}>
      <Flex direction="column">
        <div className={styles.container}>
          <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
          <div></div>
        </div>

        <Center bg={"blackAlpha.100"} blur={"xl"} width="100%" p="4rem">
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ x: 90, opacity: 0 }}
            animate={{ x: 0, opacity: 1, duration: 4 }}
          >
               {video?.metadata?.cover ? ( 
             
                      
                        <Image
                          width={"400px"}
                          height={"400px"}
                          maxW="900px"
                          maxH="650px"
                          minWidth={"500px"}
                          minHeight={"500px"}
                          borderRadius="10px"
                          margin="3rem 0rem 2rem 0rem"
                      
                          src={
                            video?.metadata?.cover?.original?.url
                          }
                          style={{
                            position: "relative",
                            borderTopLeftRadius: "5px",
                            borderTopRightRadius: "10px",
                        
                          }}
                        />):
                
            (<Image
              src={normalizeUrl(video?.metadata?.media[0]?.original?.url)}
              maxW="900px"
              maxH="650px"
              minWidth={"500px"}
              minHeight={"500px"}
              borderRadius="10px"
              margin="3rem 0rem 2rem 0rem"
            />)}
          </motion.div>
        </Center>
        <Flex padding={"2rem"}>
          <Flex direction={"column"}>
            <Text fontSize={"45px"}>{video?.metadata?.name}</Text>
            <Text fontSize="xl" color={"gray"} m="0 0 1rem 0">
              {" "}
              {video && format(new Date(video?.createdAt as number), "d LLL y")}
            </Text>
            <HStack>
              <CollectedBy id={video?.id} />
              <Divider orientation="vertical" />

              <VStack>
                <HStack spacing={"3px"}>
                  <button
                    onClick={
                      reactionData.userReaction == ReactionTypes.Upvote
                        ? () => removeReaction(video?.id, ReactionTypes.Upvote)
                        : () => upvotePublication(video?.id)
                    }
                    className="hover:bg-gray-100 rounded-full p-2"
                  >
                    <LikeButton
                      loading={reactionLoading}
                      active={reactionData.userReaction == ReactionTypes.Upvote}
                    />
                  </button>

                  <CollectAndMirrorButton
                    id={video?.id}
                    referenceModule={video?.referenceModule?.__typename}
                  />
                </HStack>
              </VStack>
            </HStack>

            <motion.div whileHover={{ scale: 1.01 }}>
              <Flex
                margin={"10px 0px 0px 0px"}
                boxShadow="base"
                p="10px"
                borderRadius="15px"
                w="-webkit-fit-content"
              >
                <LensAvatar profile={video?.profile} height={35} width={35} />
                <Text fontSize="lg" alignSelf={"center"} m="0 8px">
                  {video?.profile?.handle}
                </Text>
                <Spacer />
              </Flex>
            </motion.div>

            <Spacer />
          </Flex>
          <Spacer />
          <Flex
            paddingRight="2rem"
            direction={"column"}
            m="12px 2.5rem 0 0"
            w="-webkit-fit-content"
          >
            <VStack
              p=" 0 15px 0 10px"
              boxShadow={"lg"}
              borderRadius="15px"
              spacing={"3px"}
              m="10px"
              w="fit-content"
            >
              <HStack
                p="5px"
                spacing={"10px"}
                w="-moz-fit-content"
                padding="8px 8px 8px 8px"
              >
                {isFreeCollect &&    <div></div>}
                {isFeeCollect &&  <Text>Price</Text> 
}
{isTimedFeeCollect &&       <div><VStack spacing={"3px"}>
                  <Text fontSize={"xl"} color={"gray.800"}>
                    Price
                  </Text>
                  <Text fontSize="38px">0.1 ETH</Text>
                </VStack>
                <Divider orientation="vertical" h="60%" />

                <TimedAuction /></div>}
                {isLimitedTimeFeeCollect &&       <VStack><HStack><VStack spacing={"3px"}>
                  <Text fontSize={"xl"} color={"gray.800"}>
                    Price
                  </Text>
                  <Text fontSize="38px">0.1 ETH</Text>
                </VStack>
                <Divider orientation="vertical" h="60%" />

                <TimedAuction /></HStack>   <Text fontSize="50px" color={"gray.700"}>10/100</Text></VStack>}
                {isLimitedFeeCollect &&<HStack><VStack spacing={"3px"}>
                  <Text fontSize={"xl"} color={"gray.800"}>
                    Editions
                  </Text>
                  <Text fontSize="38px">10/100</Text>
                </VStack>
                <Divider orientation="vertical" h="60%" />

                <VStack spacing={"3px"}>
                  <Text fontSize={"xl"} color={"gray.800"}>
                    Price
                  </Text>
                  <Text fontSize="38px">0.1 ETH</Text>
                </VStack></HStack> }
             
              </HStack>
              <Divider orientation="horizontal" h="60%" p="10px" />
              <CollectButton video={video} />
            </VStack>
          </Flex>
        </Flex>
        <Divider />
        <Flex direction={"column"} p="1rem 2rem">
          <Flex>
            <Flex direction="column">
              <Text fontSize={"30px"}>Description</Text>
              <Linkify
                properties={{
                  style: { color: "blue", fontWeight: "bold" },
                }}
              >
                <Text fontSize={"25px"}>{video?.metadata?.description}</Text>
              </Linkify>
            </Flex>
          </Flex>
          <Text fontSize={"lg"} as="b" margin="1rem 0">
            Comments:
          </Text>
          {video && <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1.01 }}>
            <CommentField id={video?.id} />
          </motion.div>}
          {comments?.map((comment, index) => (
            <Flex direction={"column"} key={index} >
              <Flex margin="1rem 0 0 0" padding="8spx" w="70%" key={index}>
                <LensAvatar profile={comment?.profile} width={10} height={10} />
                <Flex direction={"column"} marginLeft="0.5rem">
                  <Text fontSize="md">{comment?.profile?.handle}</Text>
                  <Text fontSize="md" color="gray.600">
                    Replying to {video?.profile?.handle}
                  </Text>
                  <Text fontSize="md">{comment?.metadata?.content}</Text>
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
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

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  
  const {
    data: { video },
  } = await nodeClient.query<{ video: Maybe<Post> }>({
    query: GET_PUBLICATION,
    variables: { id },
  });

  if (!video) return { notFound: true };

  return {
    props: { video },
  };
};

export default MusicPost;
