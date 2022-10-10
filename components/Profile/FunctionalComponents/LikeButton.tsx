import React from "react";
import {
  Flex,
  VStack,
  Spacer,
  Text,
  Button,
  Box,
  Avatar,
  HStack,
  AspectRatio,
  SimpleGrid,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { useProfile } from "../../../context/context";
import useReactToPublication from "../../../hooks/lens/useReactToPublication";
import { useRouter } from "next/router";
import { ReactionTypes } from "../../../types/index";
import LikeButton from "components/Posts/CollectModule/LikeButtonVariant";
import { motion } from "framer-motion";
function PublicationReaction(props) {
  const router = useRouter();
  const { profile } = useProfile();

  const publication = props.publication;

  const {
    removeReaction,
    data: reactionData,
    upvotePublication,
    downvotePublication,
    loading: reactionLoading,
  } = useReactToPublication(publication?.id);

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={
          reactionData.userReaction == ReactionTypes.Upvote
            ? () => removeReaction(publication?.id, ReactionTypes.Upvote)
            : () => upvotePublication(publication?.id)
        }
        className="hover:bg-gray-100 rounded-full p-2"
      >
        <LikeButton
          loading={reactionLoading}
          active={reactionData.userReaction == ReactionTypes.Upvote}
        />
      </motion.button>
    </div>
  );
}

export default PublicationReaction;
