import {
  Avatar,
  Divider,
  Flex,
  Image,
  Text,
  Box,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

import { useQuery, gql } from "@apollo/client";

function PostPreview() {
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: {
      id,
    },
  });

  console.log(data);

  if (loading)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  if (error) return <Text> Something went wrong ${error}</Text>;

  return (
    <Flex dir="column">
      <Image></Image>
      <Flex>
        <Avatar></Avatar>
      </Flex>
      <Text fontSize="lg"></Text>
      <Text fontSize="sm" color="gray.500"></Text>
      <Text fontSize="sm"></Text>
    </Flex>
  );
}

export default PostPreview;
