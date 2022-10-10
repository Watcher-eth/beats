import React from 'react'
import MusicPlayer from 'components/Music Player/MusicPlayer'
import { useCollectionQuery } from '@spinamp/spinamp-hooks';
import AudioPlayer from "../../components/Music Player/AudioPlayer"
import SpinPlaylist from 'components/Music Player/Playlists/SpinPlaylist';
function index() {

  return (
    <div>
  <SpinPlaylist/>
   </div>
  )
}

export default index