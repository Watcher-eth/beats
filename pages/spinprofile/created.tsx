import React, { useContext, useEffect, useState } from 'react'
import {useAllTracksQuery } from "@spinamp/spinamp-hooks";
import { Avatar, Box, Flex, HStack, IconButton, SimpleGrid, Spacer, Text, VStack } from '@chakra-ui/react';
import {fetchArtistTracks, IArtist, ITrack} from '@spinamp/spinamp-sdk';
import {motion} from "framer-motion"
import PlayCollectionButton from 'components/Profile/FunctionalComponents/PlayCollectionButton';
import Link from 'next/link';
import Image from 'next/image';
import playerContext from 'context/AudioContext/playerContext';
import { FaPlay } from 'react-icons/fa';

function Created(props) {
  const [songs, setSongs] = useState<ITrack[]>()
  const [artist, setArtist] = useState<IArtist>()
const id = props?.id
console.log(name)

useEffect(()=>{fetchArtistTracks(id).then((tracks: ITrack[] ) => {
   
  setSongs(tracks)
  console.log(tracks)
});}, [])


const {SetCurrent} = useContext(playerContext)

    
if(songs)
  return (
    <div>{songs && <PlayCollectionButton collection={songs}/>}
    <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing={10}>
      {songs?.map((item, index) => {
        return (
          <motion.div
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
                <motion.div whileHover={{scale: 1.01}} style={{alignSelf: "start", margin: "5px"}}>
                <Link href={`/spinprofile/${item?.artist?.name}`} key={index}><a>
                
                <HStack w="100%" p={"0 10px 15px 0"}>
                
                  <Avatar
                    name={props?.name}
                    src={item?.artist?.profiles?.sound?.avatarUrl}
                    size="xs"
                  />
                  <Text fontSize="lg">{item?.artist?.name}</Text>

                </HStack>
                </a></Link>
                </motion.div>
              </VStack>
            </Box>
          </motion.div>
        );
      })}
    </SimpleGrid>
    </div>
  )
}

export default Created