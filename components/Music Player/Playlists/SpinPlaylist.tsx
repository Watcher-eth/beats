import React, { useEffect, useState } from 'react'
import {fetchFeaturedPlaylists, fetchPlaylistById, IPlaylist, ITrack} from '@spinamp/spinamp-sdk';
import { Text, VStack,  Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
   
    Center,
    Button,
    SimpleGrid,
    Flex,
    Box,
    Divider,
    Spacer,
    HStack, } from '@chakra-ui/react';
import SongList from './SongList';
import {motion} from "framer-motion"
import Link from 'next/link';

function SpinPlaylist() {
   
const [playlists, setPlaylists] = useState<IPlaylist[]>()
 useEffect(()=>{ fetchFeaturedPlaylists().then((playlist: IPlaylist[] ) => {
        setPlaylists(playlist)
            console.log(playlist)
           })},[])
   

                  
if(playlists)
  return (
 
    <VStack m="5rem"> <VStack><Text fontSize={"35px"}>Playlists</Text> <Text fontSize={"20px"} color="gray.500">Discover trending playlist from some of the top curators in the space. Or create your own playlist and share them with your friends.</Text><Divider p="0rem 0 1.5rem 0" orientation='horizontal'/><HStack spacing={["25vw","43vw","50vw","50vw"]}><Text p=" 0.5rem 0 0  0" fontSize={"23px"} color={"gray.600"} alignSelf="start">Trending Playlists</Text>  <motion.div whileHover={{ scale: 1.03 }}>
    <Link href={"/createPlaylist"}>
      <Button
      bg="blackAlpha.800"
        borderRadius={"20px"}
    color="white"
      
      >
        Create Playlist
      </Button>
    </Link>
  </motion.div></HStack> </VStack><SimpleGrid
          
    columns={[1,2,3,4]}
     spacing={10}
   
   
     p="1rem"> {playlists.map((item, index) => {
        return ( <Link   href={`/playlist/${item?.id}`}
       ><a> <motion.div   key={index} whileHover={{scale: 1.04}} ><Box alignItems={"center"}  p="15px" boxShadow="lg" borderRadius={"12px"}><Text alignSelf={"center"} fontSize={"20px"}>{item?.title}</Text></Box></motion.div></a></Link>)})}
  </SimpleGrid>  </VStack>
  )
}

export default SpinPlaylist