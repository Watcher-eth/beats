import React from 'react'


import Controls from './Controls'
import {BsList} from "react-icons/bs"
import PlayerState from '../../context/AudioContext/PlayerState'

import styles from "../../styles/main.module.css"
import { useCollectionQuery } from '@spinamp/spinamp-hooks'
import SetSongs from './SetSongs'


const close = () => {
  console.log('Closing the app')
}

function AudioPlayer() {






  
  return (
   

      <div className={styles.main}>
    
   

    
        <Controls />
      </div>

  )
}

export default AudioPlayer
