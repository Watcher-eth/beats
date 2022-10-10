import {
  Flex,
  VStack,
  Spacer,
  Text,
  Button,
  Box,
  Avatar,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

function FeedShimmer() {
  return (
    <SimpleGrid minChildWidth={"400px"} spacing={10}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Box
          bg="blackAlpha"
          height=""
          borderTopRadius={"10px"}
          borderBottomRadius={"10px"}
          boxShadow="base"
        ></Box>
      </motion.div>
    </SimpleGrid>
  );
}

export default FeedShimmer;
