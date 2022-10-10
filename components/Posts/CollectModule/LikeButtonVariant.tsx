import React, { FC } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { motion } from "framer-motion";

const LikeButton: FC<{
  active: boolean;
  loading?: boolean;
}> = ({ loading, active }) => {
  if (loading) return <span>loading</span>;
  return active ? (
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.2 }}>
      <FcLike size={"28px"} />
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.2 }}>
      <FcLikePlaceholder size={"28px"} />
    </motion.div>
  );
};

export default LikeButton;
