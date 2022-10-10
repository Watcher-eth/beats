import { Center } from '@chakra-ui/react'
import { useCollectionQuery } from '@spinamp/spinamp-hooks';
import CarouselSelect from 'components/common/CarouselSelect'
import { useProfile } from 'context/context';
import React, { useState } from 'react'

function SelectCollection(props) {
 const {profile} = useProfile()
 const [selectedIds, setSelectedIds] = useState([])
const [selectedCover, setSelectedCover] = useState([])
  const { collection, isLoading, isError, refetch } = useCollectionQuery(
    "0xA0125FDcb3e65A2cEaDF459B8d4454167eC51D7E"
  );
  return (
    <div> <Center overflow="hidden" w="1200px">
    <CarouselSelect id={collection} setSong={setSelectedIds} />
  </Center></div>
  )
}

export default SelectCollection