import React from 'react'
import {useArtistNftsOwnersQuery } from "@spinamp/spinamp-hooks";
import { Text } from '@chakra-ui/react';
function Owners(props) {

    
const { owners } = useArtistNftsOwnersQuery(
        props?.id
      );
  return (
   <div> <Text>{owners?.length}</Text></div>
  )
}

export default Owners