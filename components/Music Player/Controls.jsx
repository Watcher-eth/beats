import { Box, Button, HStack, IconButton, Input, Spacer, Text, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,

  useDisclosure, Center} from '@chakra-ui/react'
  import {BsList} from "react-icons/bs"
  import PlayList from "./playlist/Playlist"
import React, { useState, useEffect, useRef, useContext } from 'react'
import playerContext from '../../context/AudioContext/playerContext'
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRandom } from "react-icons/fa";
import styles from "../../styles/main.module.css"
import { FaPlay } from "react-icons/fa";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import SetSongs from './SetSongs'
import {motion} from "framer-motion"
import { useCollectionQuery } from '@spinamp/spinamp-hooks';
import Image from 'next/image';
function Controls() {
  // Global State

  


 
  const {
    currentSong,
    songs,
    nextSong,
    prevSong,
    repeat,
    random,
    playing,
    toggleRandom,
    toggleRepeat,
    togglePlaying,
    handleEnd,
    songslist,
    songsSet,
    
  } = useContext(playerContext)

  const audio = useRef('audio_tag')

  // self State
  const [statevolum, setStateVolum] = useState(0.3)
  const [dur, setDur] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fmtMSS = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + ~~s
  }

  const toggleAudio = () =>
    audio.current.paused ? audio.current.play() : audio.current.pause()

  const handleVolume = (q) => {
    setStateVolum(q)
    audio.current.volume = q
  }

  const handleProgress = (e) => {
    let compute = (e.target.value * dur) / 100
    setCurrentTime(compute)
    audio.current.currentTime = compute
  }

  useEffect(() => {
   
  }, [])
  


  useEffect(() => {
    audio.current.volume = statevolum
    if (playing) {
      toggleAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong])
  
  return (

    <HStack className={styles.controls}>
   

      <Box className={styles.progressb}>
       
      <Box height={"85px"} width={"85px"} borderRadius={"15px"} p="10px" >
      <motion.div whileHover={{scale: 1.03}} onTap={onOpen}>
         <Image height={"65px"} layout="intrinsic" width={"65px"} src={songslist[currentSong]?.lossyArtworkUrl} style={{borderRadius: "5px"}}/>
         </motion.div>
         </Box>
        <Box className={styles.songMeta}>
          <Text className={styles.songtitle}>{songslist[currentSong]?.title}</Text>
          <Text className={styles.songartistName}>
            {songslist[currentSong]?.artist?.name}
          </Text>
        </Box>
   
        <input
          onChange={handleProgress}
      
          value={dur ? (currentTime * 100) / dur : 0}
          type="range"
          name="progresBar"
          style={{  width:"550px", }}
          id="prgbar"
        />
        <Text className={styles.currentT}>{fmtMSS(currentTime)}</Text>/
        <Text className={styles.totalT} >{fmtMSS(dur)}</Text>

        <Box className={styles.vlme} m="1rem">
        <span className={styles.volum}>
          <i className="fas fa-volume-down"></i>
        </span>
        <input
          value={Math.round(statevolum * 100)}
          type="range"
          name="volBar"
          id="volBar"
          className={styles.volBar}
          onChange={(e) => handleVolume(e.target.value / 100)}
        />
      </Box>
   
      <HStack p={"0 10px 0 25"} spacing={"15px"} className={styles.musicControls}>
      <motion.div whileHover={{scale: 1.1}}>
        <IconButton icon={<GrCaretPrevious/>}  onClick={prevSong} size="lg"
          color={"white"}
          bg="white"
          variant={"ghost"}>
          
          <i className="fas fa-step-backward"></i>
        </IconButton>
        </motion.div>
<motion.div whileHover={{scale: 1.1}}>
        <IconButton icon={<FaPlay/>} 
 size="lg"
          color={"white"}
          variant={"ghost"}
          onClick={() => {
            togglePlaying()
            toggleAudio()
          }}
        >
          <span className={!playing ? '' : 'hide'}>
            <i className="fas fa-play"></i>
          </span>
          Play
          <span className={!playing ? 'hide' : ''}>
            <i className="fas fa-pause"></i>
          </span>
        </IconButton>
        </motion.div>
        <motion.div whileHover={{scale: 1.1}}>
        <IconButton icon={<GrCaretNext/>}  onClick={nextSong}  size="lg"
          color={"blue"}
          bg="white"
          variant={"ghost"}>
          <i className="fas fa-step-forward"></i>
        </IconButton>
        </motion.div>
      </HStack>
      <audio
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onCanPlay={(e) => setDur(e.target.duration)}
        onEnded={handleEnd}
        ref={audio}
        type="audio/mpeg"
        preload="true"
        src={songslist[currentSong]?.lossyAudioUrl}
      />
     
      </Box>
      <Center>
              <IconButton icon={<BsList/>} variant="ghost" height={"35px"} width={"35px"} borderRadius={"25px"} onClick={onOpen}>
                Create
              </IconButton>
            </Center>
          
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={[ "md","lg","lg","xl"]}
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent p="0rem" borderRadius={"15px"} >
      

          <ModalBody>   <PlayList /></ModalBody> 
</ModalContent>
</Modal>
         
      <div className={styles.plsoptions}>
      
        <IconButton
icon={<AiOutlineRetweet/>}
          onClick={toggleRepeat}
          color="black"
          className={styles.repeat  + (styles.repeat ? 'active' : '')}
        >
          
        </IconButton>
      </div>
    </HStack>
  ) 
  
}

export default Controls
