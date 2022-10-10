import { Center, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import LensAvatar from 'components/LensAvatar'
import { normalizeUrl } from 'lib/media'
import Image from 'next/image'
import React from 'react'
import {motion} from "framer-motion"
import GET_PUBLICATION from 'graphql/publications/get-publication'
import { useQuery } from '@apollo/client'
import CollectedBy from 'components/Posts/CollectModule/CollectedBy'
function HomeMedia() {

    const id = "0xd544-0x048f"
    const { data, loading, error } = useQuery(GET_PUBLICATION, {
        variables: {
          id,
        },
      });
    if(loading) return (<div>loading...</div>)
      console.log(data)
  return (
    <Center bg={"blackAlpha.100"} blur={"xl"} width={[, "100%", "100%" ,"100%","100%"]} p={[ "8rem 0  0 0","6rem 2rem 0 2rem", "9rem 2rem 0 2rem","8rem 0 5.5rem 0"]}>
 <Text>div</Text>
      </Center>

  )
}

export default HomeMedia