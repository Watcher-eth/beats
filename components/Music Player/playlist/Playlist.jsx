import { Box, Button, Flex, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import playerContext from '../../../context/AudioContext/playerContext'
import styles from "../../../styles/main.module.css"
import { FaPlay } from "react-icons/fa";
import { useCollectionQuery } from '@spinamp/spinamp-hooks';
import Image from 'next/image';
import {motion} from "framer-motion"
function Playlist() {
  const { SetCurrent, currentSong, songslist, songsSet } = useContext(playerContext)


  return (
    <VStack w="100%">
      {/* <div className="header">
        <h4 className="pltext">Songs by artist</h4>
      </div> */}
      <ul className={styles.loi}>
        {songslist.map((song, i) => (
          <motion.div whileHover={{scale: 1.008}} key={index}>
          <li
            className={styles.songContainer + (currentSong === i ? 'selected' : '')}
            key={i}
            onClick={() => {
              SetCurrent(i)
            }}
          >
            <Box height={"65px"} width={"65px"} borderRadius={"15px"}>
         <Image alt="track cover" height={"65px"} layout="intrinsic" width={"65px"} src={song.lossyArtworkUrl} style={{borderRadius: "5px"}}/>
         </Box>
            <HStack >
            <Box className={styles.songmeta_playlist}>
              <Text className={styles.songname}>{song.title}</Text>
              <Text className={styles.songauthors}>{song?.artist?.name}</Text>
              
            </Box>
      
           
             
            </HStack>
          </li>
          </motion.div>
        ))}
      </ul>
    </VStack>
  )
}

export default Playlist
