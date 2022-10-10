import React, { FC, useEffect, useMemo, useRef, useState } from "react";
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
import { ITrack, useTrackQuery } from "@spinamp/spinamp-hooks";
import format from "date-fns/format";
import { nodeClient } from "../../lib/apolloClient";
import Linkify from "react-linkify";
import styles from "../../styles/backgroundBlurGray.module.css";
import PlayCollectionButton from "components/Profile/FunctionalComponents/PlayCollectionButton";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";


import { motion } from "framer-motion";
import Link from "next/link";


function MusicPost  ( )  {
  const router = useRouter();
  const { slug } = router.query;
  const waveform = useRef(null);
  const [isHovered, setHovered] = useState(false);
  const { track, isLoading, isError, refetch } = useTrackQuery(
    slug
  );

   // Initialize Waveform
   useEffect(() => {
    // Check if wavesurfer object is already created.
    if (!waveform.current && track) {
      const initProgress = async () => {
        try {
          const RegionsPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.regions.min.js");

          const waveSurfer = (await import("wavesurfer.js")).default;
          waveform.current = waveSurfer.create({
            container: "#waveform",
            waveColor: "#gray",
            barGap: 2,
            barWidth: 3,
            barRadius: 4,
            cursorWidth: 3,
            cursorColor: "#gray",
            height: 75,
            plugins: [
              RegionsPlugin.create({
                regionsMinLength: 10,
                regionsMaxLength: 60,
              }),
            ],
          });

      

          waveform.current.load(track?.lossyAudioUrl);
        } catch (error) {
          console.error(error);
        }
      };

      initProgress();
   }})

   const playAudio = () => {
    // Check if the audio is already playing
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
  };

  console.log(track)
  return (
    <motion.div initial="initial" exit={{ opacity: 0 }}>
      <Flex direction="column">
        <div className={styles.container}>
          <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
          <div></div>
        </div>
{track && <PlayCollectionButton collection={[track]}/>}

        <Center bg={"blackAlpha.100"} blur={"xl"} width="100%" p="4rem">
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ x: 90, opacity: 0 }}
            animate={{ x: 0, opacity: 1,  }}
          >
              
                      
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
                            track?.lossyArtworkUrl
                          }
                          style={{
                            position: "relative",
                            borderTopLeftRadius: "5px",
                            borderTopRightRadius: "10px",
                        
                          }}
                        />
                
           
          </motion.div>
        
        </Center>
    <VStack w="60rem" alignSelf={"center"}>
        <Box id="waveform" w="60rem" />
        </VStack>
        <Flex padding={"2rem"}>
          <Flex direction={"column"}>
            <Text fontSize={"45px"}>{track?.title}</Text>
            <Text fontSize="xl" color={"gray"} m="0 0 1rem 0">
              {" "}
              {track && format(new Date(track?.createdAtTime as number), "d LLL y")}
            </Text>
            <HStack>
           
              <Divider orientation="vertical" />

              <VStack>
              
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
                <Avatar src={track?.artist?.profiles?.sound?.avatarUrl} height={35} width={35} />
                <Text fontSize="lg" alignSelf={"center"} m="0 8px">
                  {track?.artist?.name}
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
            
  
              <Link href={track?.websiteUrl}><Button >{track?.platformId}</Button></Link>
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
                <Text fontSize={"25px"}>{track?.description}</Text>
              </Linkify>
            </Flex>
          </Flex>
        
        </Flex>
      </Flex>
    </motion.div>
  );
};


export default MusicPost;
