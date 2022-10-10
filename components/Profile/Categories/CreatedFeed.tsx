import React, { useMemo } from "react";
import {
  Flex,
  VStack,
  Spacer,
  Text,
  Button,
  Box,
  Avatar,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import format from "date-fns/format";
import Link from "next/link";
import { normalizeUrl, resolveImageUrl } from "lib/media";
import { useRouter } from "next/router";
import useCollectPublication from "../../../hooks/lens/useCollectPublication";
import useMirrorPublication from "../../../hooks/lens/useMirrorPublication";
import {
  Comment,
  Maybe,
  Mirror,
  PaginatedPublicationResult,
  Post,
  ReactionTypes,
} from "../../../types/index";
import { getPublications } from "../../../graphql/queries";
import { useQuery, gql } from "@apollo/client";
import PublicationReaction from "../FunctionalComponents/LikeButton";
import CollectAndMirrorButton from "../CollectAndMirrorButton";
import ReactAudioPlayer from "react-audio-player";
import { motion } from "framer-motion";
const blankPhotoStyle = {
  width: "0",
  height: "0",
  backgroundColor: "black",
};

function CreatedFeed(props) {
  const router = useRouter();

  const id = props.id;

  const { data, loading, error } = useQuery(getPublications, {
    variables: {
      id,
      limit: 24,
    },
  });

  if (error) return <div>Something went wrong on Created Feed </div>;
  console.log(data);

  return (
    <div>
  
      {!error   &&(
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing={10}>
          {data?.publications?.items.map((item, index) => {
            return (
              <motion.div
              key={index}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Box
                  bg="blackAlpha"
                  height=""
                  borderTopRadius={"10px"}
                  borderBottomRadius={"10px"}
                  boxShadow="base"
                  key={index}
                  w={["200px", "270px", "450px"]}
                >{ loading ? <div><Skeleton h="400px" w="400px"/></div> : 
                  <Link href={`/post/${item?.id}`} key={index}>
                    <a>
                      {item?.metadata?.cover ? (

                        <VStack  width={"400px"}>
                        <Box        w={["200px", "270px", "450px"]}>
                      
                        <Image
                          width={"400px"}
                          height={"400px"}
                          alt="track cover"
                          layout="responsive"
                          src={
                            item?.metadata?.cover?.original?.url
                          }
                          style={{
                            position: "relative",
                            borderTopLeftRadius: "5px",
                            borderTopRightRadius: "10px",
                        
                          }}
                        />
                        </Box>
                        <ReactAudioPlayer
                          src={item.metadata.media[0]?.original?.url}
                          controls
                        />
                      </VStack> 
                      
                      ) :   (<div><Image
                      width={"400px"}
                      height={"400px"}
                      layout="responsive"
                      alt="image"
                      src={normalizeUrl(
                        item.metadata?.media[0]?.original?.url
                      )}
                      style={{
                        position: "relative",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "10px",
                      }}
                    /></div>)}

                  
                    </a>
                  </Link>}
                  <VStack spacing="2px" m="0">
                  
                      {loading ?  (<HStack w="100%" p={" 5px 10px"}><SkeletonCircle
                        size="5"
                        isLoaded={!loading}
                        fadeDuration={1}
                      /><SkeletonText fadeDuration={1}
                      mt="4"
                      noOfLines={1}
                      isLoaded={!loading}/></HStack>) :
                     (  <HStack w="100%" p={" 5px 10px"}><Avatar
                        name={""}
                        src={normalizeUrl(props?.src)}
                        size="sm"
                      />
                       <Text fontSize="lg">{props?.name}</Text>  </HStack>)}
                  
                    <HStack p={"0 10px"} spacing="140" w="100%">
                      <HStack spacing={"8px"}>
                        <PublicationReaction publication={item} />
                        <CollectAndMirrorButton
                          id={item?.id}
                          referenceModule={item?.referenceModule?.__typename}
                          mirror={item?.stats?.totalAmountOfMirrors}
                        />
                      </HStack>
                    </HStack>
                    <Box p="10px">
                      {loading ?<SkeletonText
                        mt="4"
                        noOfLines={[1, 2, 3]}
                        spacing="10px"
                        isLoaded={!loading}
                        fadeDuration={1}
                      /> :
                      <Text noOfLines={[1, 2, 3]} overflow="auto">
                        {item?.metadata?.content}
                      </Text>}
                    </Box>

                    <Box p="0 10px 5px 10px" alignSelf={"end"}>
                     {loading ? <SkeletonText
                        fadeDuration={1}
                        mt="4"
                        noOfLines={1}
                        isLoaded={!loading}
                      /> :
                      <Text>
                        {item &&
                          format(
                            new Date(item?.createdAt as number),
                            "d LLL y"
                          )}
                      </Text>}
                    </Box>
                  </VStack>
                </Box>
              </motion.div>
            );
          })}
        </SimpleGrid>
      )}
    </div>
  );
}

export default CreatedFeed;
