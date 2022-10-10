import React, { useEffect, useRef, useState } from "react";
import { useMusicContext } from "context/MusicContext";
import { HStack, Text, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import AudioControls from "./AudioControls";
import styles from "../../styles/MusicPlayer.module.css";
import Waveform from "./Waveform";

export function MusicPlayer(title, name, imageUrl) {
  
  const artistName = name;
  const image = imageUrl;



  return (
    <HStack className={styles.audio_player}>
      <HStack className="track-info">
        <Image
          className={styles.artwork}
          src={image}
          height="200px"
          width="200px"
          alt={`track artwork for ${title} by ${artistName}`}
        />
        <Text className="title">{title}</Text>
        <Text className="artist">{artistName}</Text>

    
      </HStack>
      <Flex>
      <Waveform url={props?.audioSrc}  width="5rem"/>
      </Flex>
    </HStack>
  );
}

export default MusicPlayer;
