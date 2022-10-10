import { Button } from '@chakra-ui/react';
import { useCollectionQuery } from '@spinamp/spinamp-hooks';
import playerContext from 'context/AudioContext/playerContext';
import React, { useContext } from 'react'

function SetSongs() {


    const { SetCurrent, currentSong, songslist, songsSet } = useContext(playerContext)
    const { collection, isLoading, isError, refetch } = useCollectionQuery(
        "0xde0cbd5df89bb67ab804db21e9b931bad4200392"
      );

      if (isLoading) return <div>loading</div>
     function setSongs() {
        songsSet(collection)
        console.log(songslist)
     }
    
     
  return (
    <div><Button onClick={() => setSongs()}>Set Songs</Button></div>
  )
}

export default SetSongs