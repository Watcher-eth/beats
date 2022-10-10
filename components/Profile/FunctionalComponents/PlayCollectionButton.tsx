import { Button, Center } from '@chakra-ui/react'
import playerContext from 'context/AudioContext/playerContext'
import React, { useContext, useEffect } from 'react'

function PlayCollectionButton(collection) {
    const { SetCurrent, currentSong, songslist, songsSet } = useContext(playerContext)

console.log(collection)
 function loadCollection ( ) {
    songsSet(collection.collection)
    console.log(songslist)
 }

    useEffect(() =>{
    loadCollection()
    console.log("hello")
    }, [collection, loadCollection])


  return (
   <div></div>
  )
}

export default PlayCollectionButton