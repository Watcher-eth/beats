import React from 'react'
import {
   
    Box,
    Center,
   
    HStack,
    
    VStack,
    Flex,
  
    SkeletonCircle,
    SkeletonText,
  
    Skeleton,
    Stack,
  } from "@chakra-ui/react";

export default function Loader() {
  return (
 <Center> <VStack alignItems={"center"}> <Center><HStack><Skeleton height="30px" w="5px" /><Skeleton height="27px" w="5px" /><Skeleton height="32px" w="5px" /><Skeleton height="29px" w="5px" />
 </HStack></Center> </VStack></Center>
  )
}


