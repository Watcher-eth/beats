import React from 'react'
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg"
import { useState } from 'react'
import { useEffect } from 'react'

const ffmpeg = createFFmpeg()
function FFmpeg() {
const [ready, setReady] = useState(false)
    const load = async () => {
       
        await ffmpeg.load();  
        console.log("ready") 
        setReady(true)}
    
    
  
    useEffect(() => {
    load().catch((err) => console.log(err))
    
  }, [])
  return ready ? (
    <div>FFmpeg</div>
  ) : <div>loading</div>


}

export default FFmpeg