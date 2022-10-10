import React, { useContext, useEffect, useState } from 'react'
import {motion} from "framer-motion"
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import { ITrack } from '@spinamp/spinamp-sdk'
import PlayCollectionButton from 'components/Profile/FunctionalComponents/PlayCollectionButton'
import playerContext from 'context/AudioContext/playerContext'
function SearchList(props) {
const [track, setTrack] = useState()
const [selectedIds, setSelectedIds] = useState([])
const [selectedCover, setSelectedCover] = useState([])
const [selectedfinIds, setSelectedfinIds] = useState([])
const [selectedfinCover, setSelectedfinCover] = useState([])
useEffect(()=>{setTrack(props?.tracks)}, [props])

function onSelect (id, url ){
   setSelectedIds((prevIds) => [...prevIds, id])
   setSelectedCover((prevCovers) => [...prevCovers, url])
   let uniqueCovers = [...new Set(selectedCover)];
   let uniqueIds= [...new Set(selectedIds)];
   setSelectedfinIds(uniqueIds)
   setSelectedfinCover(uniqueCovers)
  console.log(uniqueCovers)
  console.log(uniqueIds)
}


const {SetCurrent} = useContext(playerContext)
if(track)
  return (<VStack w={["50vw"]}>{track && <PlayCollectionButton collection={[track]}/>}
   <motion.div style={{borderRadius: "8px"}} whileHover={{scale: 1.01, background: "lightgray", color: "white"
        }} whileTap={{scale: 1.03, background: "gray", color: "white"
    }} onClick={() => onSelect(track?.id, track?.lossyArtworkUrl)} ><HStack w="400px" boxShadow="lg" borderRadius="8px" p="0.2rem" m="0.15rem"><Image height="80px" width="80px" layout='intrinsic' style={{borderRadius: "5px", margin: "5px"}} src={track?.lossyArtworkUrl}/><Flex m="" direction={"column"}  p="1rem"> <Text p="0px 10px" fontSize={"20px"}>{track?.title}</Text><Text p="0px 10px" fontSize={"17px"} color={"gray.500"}>{track?.artist?.name}</Text></Flex>     </HStack></motion.div><VStack  p="1rem" ><Text alignSelf={"start"} fontSize={"25px"}>Selected Tracks:</Text>
    {selectedfinCover &&<HStack spacing={"14px"}>{selectedfinCover?.map((cover, index) => {
        return(<Box  height={"100px"} width={"100px"}><Image  height={"100px"} style={{borderRadius: "5px",}} width={"100px"} layout="intrinsic" src={cover}/></Box>)
    })}</HStack>}
    </VStack>
    </VStack>
  )
}

export default SearchList