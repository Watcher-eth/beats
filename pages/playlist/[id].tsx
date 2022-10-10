import React, { useContext, useEffect, useState } from 'react'
import {fetchFeaturedPlaylists, fetchPlaylistById, IPlaylist, ITrack} from '@spinamp/spinamp-sdk';
import { usePlaylistDetailsQuery } from "@spinamp/spinamp-hooks";
import { useRouter } from 'next/router';
import {motion} from "framer-motion"
import { Center, Flex, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import playerContext from 'context/AudioContext/playerContext';
import PlayCollectionButton from 'components/Profile/FunctionalComponents/PlayCollectionButton';
function SongList(props) {
    const [songs, setSongs] =useState()
    const router = useRouter();
  const { id } = router.query;

    const { playlist, playlistTracks, isLoading, isError, refetch } = usePlaylistDetailsQuery(
        id
      );
      const {SetCurrent} = useContext(playerContext)
     
      console.log(playlistTracks)
      console.log(playlist)
  
  return (
 <VStack> <Text m="2rem" fontSize={"35px"} color={"gray.600"}>{playlist?.title}</Text>  
 {playlistTracks && <PlayCollectionButton collection={playlistTracks}/>}
  <SimpleGrid
          
columns={[1,1,2,3]}
  spacing={10}


 p="1rem">
   {playlistTracks?.map((item, index) => {
        return (<motion.div style={{borderRadius: "8px"}} whileHover={{scale: 1.01, background: "lightgray", color: "white"
        }} whileTap={{scale: 1.03, background: "gray", color: "white"
    }} onClick={() => SetCurrent(index)} ><HStack boxShadow="lg" borderRadius="8px" p="0.2rem" m="0.15rem"><Image height="80px" width="80px" layout='intrinsic' style={{borderRadius: "5px", margin: "5px"}} src={item?.lossyArtworkUrl}/><Flex m="" direction={"column"}  key={index} p="1rem"> <Text p="0px 10px" fontSize={"20px"}>{item?.title}</Text><Text p="0px 10px" fontSize={"17px"} color={"gray.500"}>{item?.artist?.name}</Text></Flex>     </HStack></motion.div>)})}
</SimpleGrid></VStack>
  )
}

export default SongList