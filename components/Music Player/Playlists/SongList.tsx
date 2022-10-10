import React, { useEffect, useState } from 'react'
import {fetchFeaturedPlaylists, fetchPlaylistById, IPlaylist, ITrack} from '@spinamp/spinamp-sdk';
import { useArtistQuery } from "@spinamp/spinamp-hooks";
function SongList(props) {
    const [songs, setSongs] =useState()
    const id = props.id

    useEffect(()=>{  fetchPlaylistById(id).then((playlist: IPlaylist[], playlistTracks: ITrack[] ) => {
        setSongs(playlistTracks)
        console.log(songs)
      });}, [id])

       

  
  return (
    <div>SongList</div>
  )
}

export default SongList